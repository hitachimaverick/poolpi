﻿(function ($) {
    $.widget('pic.configGeneral', {
        options: {},
        _create: function () {
            var self = this, o = self.options, el = self.element;
            self._buildControls();
        },
        _buildControls: function () {
            var self = this, o = self.options, el = self.element;
            el.addClass('picConfigCategory');
            el.addClass('cfgGeneral');
            $.getApiService('/config/options/general', null, function (opts, status, xhr) {
                console.log(opts);
                $('<div></div>').appendTo(el).pnlPersonalInfo({ countries: opts.countries })[0].dataBind(opts.pool);
                $('<div></div>').appendTo(el).pnlTimeDate({ timeZones: opts.timeZones, clockModes: opts.clockModes, clockSources: opts.clockSources })[0].dataBind(opts.pool);
                $('<div></div>').appendTo(el).pnlDelays()[0].dataBind(opts.pool);
                $('<div></div>').appendTo(el).pnlSensorCalibration({ sensors: opts.sensors, tempUnits: opts.tempUnits })[0].dataBind(opts.pool);
                $('<div></div>').appendTo(el).pnlAlerts({})[0].dataBind(opts.alerts);
                $('<div></div>').appendTo(el).pnlSecurity({})[0].dataBind(opts.security);
            });
        }
    });
})(jQuery); // General Tab
(function ($) {
    $.widget('pic.pnlPersonalInfo', {
        options: {},
        _create: function () {
            var self = this, o = self.options, el = self.element;
            self._buildControls();
            el[0].dataBind = function (obj) { return self.dataBind(obj); };
        },
        _buildControls: function () {
            var self = this, o = self.options, el = self.element;
            el.empty();
            el.addClass('picConfigCategory cfgPersonalInfo');
            var acc = $('<div></div>').appendTo(el).accordian({ columns: [{ text: 'Personal Information', glyph: 'far fa-newspaper', style: { width: '15rem' } }] });
            var pnl = acc.find('div.picAccordian-contents');
            var line = $('<div></div>').appendTo(pnl);
            $('<div></div>').appendTo(line).inputField({ labelText: 'Pool Alias', binding: 'alias', inputAttrs: { maxlength: 16 }, labelAttrs: { style: { width: '5.7rem' } } });
            $('<div></div>').appendTo(line).inputField({ labelText: 'Owner', binding: 'owner.name', inputAttrs: { maxlength: 16 }, labelAttrs: { style: { width: '4.5rem', marginLeft: '.7rem' } } });
            line = $('<div></div>').appendTo(pnl);
            $('<div></div>').appendTo(line).inputField({ labelText: 'Phone', binding: 'owner.phone', inputAttrs: { maxlength: 16 }, labelAttrs: { style: { width: '5.7rem' } } });
            $('<div></div>').appendTo(line).inputField({ labelText: 'e-mail', binding: 'owner.email', inputAttrs: { maxlength: 32 }, labelAttrs: { style: { width: '4.5rem', marginLeft: '.7rem' } } });
            line = $('<div></div>').appendTo(pnl);
            $('<div></div>').appendTo(line).inputField({ labelText: 'Alt Phone', binding: 'owner.phone2', inputAttrs: { maxlength: 16 }, labelAttrs: { style: { width: '5.7rem' } } });
            $('<div></div>').appendTo(line).inputField({ labelText: 'Alt e-mail', binding: 'owner.email2', inputAttrs: { maxlength: 32 }, labelAttrs: { style: { width: '4.5rem', marginLeft: '.7rem' } } });
            line = $('<div></div>').appendTo(pnl);
            $('<div></div>').appendTo(line).pickList({
                labelText: 'Country', binding: 'location.country',
                columns: [{ binding: 'val', hidden: true, text: 'name', style: { whiteSpace: 'nowrap' } }, { binding: 'desc', text: 'Country', style: { whiteSpace: 'nowrap' } }],
                items: o.countries, inputAttrs: { style: { width: '7rem' } }, bindColumn: 1, labelAttrs: { style: { width: '5.7rem' } }
            });
            line = $('<div></div>').appendTo(pnl);
            $('<div></div>').appendTo(line).inputField({ labelText: 'Address', binding: 'location.address', inputAttrs: { maxlength: 32 }, labelAttrs: { style: { width: '5.7rem' } } });

            line = $('<div></div>').appendTo(pnl);
            $('<div></div>').appendTo(line).inputField({ labelText: 'City', binding: 'location.city', inputAttrs: { maxlength: 16 }, labelAttrs: { style: { width: '5.7rem' } } });
            $('<div></div>').appendTo(line).inputField({ labelText: 'State', binding: 'location.state', inputAttrs: { maxlength: 16 }, labelAttrs: { style: { marginLeft: '.7rem' } } });
            $('<div></div>').appendTo(line).inputField({ labelText: 'Zip', binding: 'location.zip', inputAttrs: { maxlength: 10 }, labelAttrs: { style: { marginLeft: '.7rem' } } });
            line = $('<div></div>').appendTo(pnl);
            var fldLatitude = $('<div></div>').appendTo(line).inputField({
                readOnly: true,
                labelText: 'Latitude', binding: 'location.latitude', dataType: 'number', fmtMask: '#,##0.00####', emptyMask: '',
                inputAttrs: { maxlength: 10, style: { textAlign: 'right' } }, labelAttrs: { style: { width: '5.7rem' } }
            });
            var fldLongitude = $('<div></div>').appendTo(line).inputField({
                labelText: 'Longitude', binding: 'location.longitude', dataType: 'number', fmtMask: '#,##0.00####', emptyMask: '',
                inputAttrs: { maxlength: 10, style: { textAlign: 'right' } }, labelAttrs: { style: { width: '4.5rem', marginLeft: '.7rem' } }
            });
            var btnGPS = $('<div id="btnGetGPS"></div>').appendTo(line).actionButton({ text: 'Get Location', icon: '<i class="fas fa-location-arrow"></i>' })
                .css({ marginLeft: '1rem' })
                .on('click', function (evt) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                        fldLatitude.val(pos.coords.latitude);
                        fldLongitude.val(pos.coords.longitude);
                    }, (err) => {
                        console.log(err);
                    });
                });
            var pnlType = $('div.dashOuter').attr('data-controllertype');
            if (!('geolocation' in navigator) || window.location.protocol !== 'https:' || pnlType === 'IntelliCenter') btnGPS.hide();
            if (pnlType === 'IntelliCenter') {
                fldLongitude[0].disabled(true);
                fldLatitude[0].disabled(true);
            }
            var btnPnl = $('<div class="picBtnPanel btn-panel"></div>').appendTo(pnl);
            var btnSave = $('<div id="btnSavePersonal"></div>').appendTo(btnPnl).actionButton({ text: 'Save Personal', icon: '<i class="fas fa-save"></i>' });
            btnSave.on('click', function (e) {
                var p = $(e.target).parents('div.picAccordian-contents:first');
                var v = dataBinder.fromElement(p);
                $.putApiService('/config/general', v, 'Saving Personal Information...', function(data, status, xhr) {
                    self.dataBind(data);
                });
            });
        },
        dataBind: function (obj) {
            var self = this, o = self.options, el = self.element;
            dataBinder.bind(el, obj);
        }
    });
})(jQuery); // Personal Info
(function ($) {
    $.widget('pic.pnlTimeDate', {
        options: {},
        _create: function () {
            var self = this, o = self.options, el = self.element;
            self._buildControls();
            el[0].dataBind = function (obj) { return self.dataBind(obj); };
        },
        _buildControls: function () {
            var self = this, o = self.options, el = self.element;
            el.empty();
            el.addClass('picConfigCategory cfgTimeDate');
            var acc = $('<div></div>').appendTo(el).accordian({ columns: [{ text: 'Time & Date', glyph: 'far fa-clock', style: { width: '15rem' } }] });
            var pnl = acc.find('div.picAccordian-contents');
            var line = $('<div></div>').appendTo(pnl);
            $('<div></div>').appendTo(line).pickList({
                labelText: 'Time Zone', binding: 'location.timeZone',
                displayColumn: 2,
                columns: [{ binding: 'val', hidden: true, text: 'Id', style: { whiteSpace: 'nowrap' } }, { binding: 'abbrev', hidden: false, text: 'Code', style: { whiteSpace: 'nowrap' } }, { binding: 'name', text: 'Time Zone', style: { whiteSpace: 'nowrap' } }],
                items: o.timeZones, inputAttrs: { style: { width: '12rem' } }, labelAttrs: { style: { width: '5.7rem'} }
            });
            $('<div></div>').appendTo(line).checkbox({ labelText: 'Auto Adjust DST', binding: 'options.adjustDST' });
            line = $('<div></div>').appendTo(pnl);
            $('<div></div>').appendTo(line).pickList({
                labelText: 'Clock Mode', binding: 'options.clockMode', bindColumn: 0,
                columns: [{ binding: 'val', hidden: true, text: 'Id', style: { whiteSpace: 'nowrap' } }, { binding: 'name', text: 'Mode', style: { whiteSpace: 'nowrap' } }],
                items: o.clockModes, inputAttrs: { style: { width: '5rem' } }, labelAttrs: { style: { width: '5.7rem' } }
            });
            if (o.clockSources.length > 1) {
                $('<div></div>').appendTo(line).pickList({
                    labelText: 'Clock Source', binding: 'options.clockSource', bindColumn: 0,
                    columns: [{ binding: 'name', hidden: true, text: 'Name', style: { whiteSpace: 'nowrap' } }, { binding: 'desc', text: 'Source', style: { whiteSpace: 'nowrap' } }],
                    items: o.clockSources, inputAttrs: { style: { width: '5rem' } }, labelAttrs: { style: { marginLeft: '1rem' } }
                });
            }
            btnPnl = $('<div class="picBtnPanel btn-panel"></div>').appendTo(pnl);
            btnSave = $('<div id="btnSaveTimeDate"></div>').appendTo(btnPnl).actionButton({ text: 'Save Time & Date', icon: '<i class="fas fa-save"></i>' });
            btnSave.on('click', function (e) {
                //$(this).addClass('disabled');
                //$(this).find('i').addClass('burst-animated');
                var p = $(e.target).parents('div.picAccordian-contents:first');
                var v = dataBinder.fromElement(p);
                console.log(v);
                $.putApiService('/config/general', v, 'Saving Time & Date Information...', function (data, status, xhr) {
                    self.dataBind(data);
                });

                // Send this off to the server.
                //$(this).find('span.picButtonText').text('Loading Config...');
                //$.putApiService('/app/config/reload', function (data, status, xhr) {
            });
        },
        dataBind: function (obj) {
            var self = this, o = self.options, el = self.element;
            dataBinder.bind(el, obj);
        }
    });
})(jQuery); // Time & Date
(function ($) {
    $.widget('pic.pnlDelays', {
        options: {},
        _create: function () {
            var self = this, o = self.options, el = self.element;
            self._buildControls();
            el[0].dataBind = function (obj) { return self.dataBind(obj); };
        },
        _buildControls: function () {
            var self = this, o = self.options, el = self.element;
            el.empty();
            el.addClass('picConfigCategory cfgDelays');
            var acc = $('<div></div>').appendTo(el).accordian({ columns: [{ text: 'Delays', glyph: 'fas fa-stopwatch', style: { width: '15rem' } }] });
            var pnl = acc.find('div.picAccordian-contents');
            var line = $('<div></div>').appendTo(pnl);
            $('<div></div>').appendTo(line).checkbox({ labelText: 'Manual OP Priority', binding: 'options.manualPriority' });
            line = $('<div></div>').appendTo(pnl);
            $('<div></div>').appendTo(line).checkbox({ labelText: 'Pump Off During Valve Action', binding: 'options.pumpDelay' });
            $('<div></div>').appendTo(line).checkbox({ labelText: 'Heater Cooldown Delay', binding: 'options.cooldownDelay' });
            btnPnl = $('<div class="picBtnPanel btn-panel"></div>').appendTo(pnl);
            btnSave = $('<div id="btnSaveDelays"></div>').appendTo(btnPnl).actionButton({ text: 'Save Delays', icon: '<i class="fas fa-save"></i>' });
            btnSave.on('click', function (e) {
                //$(this).addClass('disabled');
                //$(this).find('i').addClass('burst-animated');
                var p = $(e.target).parents('div.picAccordian-contents:first');
                var v = dataBinder.fromElement(p);
                console.log(v);
                $.putApiService('/config/general', v, 'Saving Delays...', function (data, status, xhr) {
                    console.log(data);
                    self.dataBind(data);
                });
            });
        },
        dataBind: function (obj) {
            var self = this, o = self.options, el = self.element;
            dataBinder.bind(el, obj);
        }
    });
})(jQuery); // Delays
(function ($) {
    $.widget('pic.pnlSensorCalibration', {
        options: {},
        _create: function () {
            var self = this, o = self.options, el = self.element;
            self._buildControls();
            el[0].dataBind = function (obj) { return self.dataBind(obj); };
        },
        _buildControls: function () {
            var self = this, o = self.options, el = self.element;
            el.empty();
            el.addClass('picConfigCategory cfgSensorCalibration');
            var acc = $('<div></div>').appendTo(el).accordian({ columns: [{ text: 'Sensor Calibration', glyph: 'fas fa-balance-scale-right', style: { width: '15rem' } }] });
            var pnl = acc.find('div.picAccordian-contents');
            var line = $('<div></div>').appendTo(pnl);
            $('<span style="margin-left:8.5rem"></span><label style="width:7rem;text-align:center;">Adjusted Value</label><span style="width:5rem;display:inline-block;"></span><label style="width:7rem;text-align:center;">True Readout</label>').appendTo(line);
            var tempUnits = o.tempUnits.find(elem => elem.val === 0) || { val: 0, name: "F", desc: "Fahrenheit" };
            for (var k = 0; k < o.sensors.length; k++) {
                var sensor = o.sensors[k];
                line = $('<div></div>').appendTo(pnl);
                $('<div></div>').appendTo(line).valueSpinner({ labelText: sensor.name, binding: 'sensorRaw.' + sensor.binding + '_adj', value: sensor.temp, min: -50, max: 150, step: 1, maxlength: 5, units: '°' + tempUnits.name, labelAttrs: { style: { width: '8.5rem' } } });
                $('<span></span>').css({ width: '4.5rem', display: 'inline-block' }).appendTo(line);
                $('<span></span>').appendTo(line).attr('data-bind', 'sensorRaw.' + sensor.binding + '_curr').attr('data-datatype', 'number').text(sensor.temp - sensor.tempAdj)
                    .css({ width: '7rem', display: 'inline-block', textAlign:'center' });
            }
            btnPnl = $('<div class="picBtnPanel btn-panel"></div>').appendTo(pnl);
            btnSave = $('<div id="btnSaveCalibration"></div>').appendTo(btnPnl).actionButton({ text: 'Save Calibration', icon: '<i class="fas fa-save"></i>' });
            btnSave.on('click', function (e) {
                var p = $(e.target).parents('div.picAccordian-contents:first');
                var raw = dataBinder.fromElement(el);
                var v = { options: {} };
                for (var prop in raw.sensorRaw) {
                    if (prop.endsWith('_curr')) {
                        var offName = prop.replace('_curr', '');
                        v.options[offName] = raw.sensorRaw[offName + '_adj'] - raw.sensorRaw[offName + '_curr'];
                    }
                }
                console.log(v);
                // Send this off to the server.
                $.putApiService('/config/general', v, 'Saving Sensor Calibration...', function (data, status, xhr) {
                    // We need to hold onto the original sensor adjustment temperature but adjust the new true readout.  We do this
                    // because the web interface jumps all over the place when making the adjustments.  It's annoying in the end the
                    // current true readout value should not change.  It should only put the adjusted value back if it was not
                    // set on the server.
                    data.sensorRaw = {};
                    for (var j = 0; j < data.sensors.length; j++) {
                        var sensor = data.sensors[j];
                        if (v.options[sensor.binding] !== sensor.tempAdj) {
                            data.sensorRaw[sensor.binding + '_curr'] = sensor.temp - sensor.tempAdj;
                            data.sensorRaw[sensor.binding + '_adj'] = sensor.temp;
                        }
                    }
                    self.dataBind(data);
                });

            });
        },
        dataBind: function (obj) {
            var self = this, o = self.options, el = self.element;
            dataBinder.bind(el, obj);
        }
    });
})(jQuery); // Sensor Calibration
(function ($) {
    $.widget('pic.pnlAlerts', {
        options: {},
        _create: function () {
            var self = this, o = self.options, el = self.element;
            self._buildControls();
            el[0].dataBind = function (obj) { return self.dataBind(obj); };
        },
        _buildControls: function () {
            var self = this, o = self.options, el = self.element;
            el.empty();
            el.addClass('picConfigCategory cfgAlerts');
            var acc = $('<div></div>').appendTo(el).accordian({ columns: [{ text: 'Alerts', glyph: 'far fa-bell', style: { width: '15rem' } }] });
            var pnl = acc.find('div.picAccordian-contents');
            var line = $('<div></div>').appendTo(pnl);
            btnPnl = $('<div class="picBtnPanel btn-panel"></div>').appendTo(pnl);
            btnSave = $('<div id="btnSaveAlerts"></div>').appendTo(btnPnl).actionButton({ text: 'Save Alerts', icon: '<i class="fas fa-save"></i>' });
            btnSave.on('click', function (e) {
                $(this).addClass('disabled');
                $(this).find('i').addClass('burst-animated');
                // Send this off to the server.
                //$(this).find('span.picButtonText').text('Loading Config...');
                //$.putApiService('/app/config/reload', function (data, status, xhr) {
            });
        },
        dataBind: function (obj) {
            var self = this, o = self.options, el = self.element;
            dataBinder.bind(el, obj);
        }
    });
})(jQuery); // Alerts
(function ($) {
    $.widget('pic.pnlSecurity', {
        options: {},
        _create: function () {
            var self = this, o = self.options, el = self.element;
            self._buildControls();
            el[0].dataBind = function (obj) { return self.dataBind(obj); };
        },
        _buildControls: function () {
            var self = this, o = self.options, el = self.element;
            el.empty();
            el.addClass('picConfigCategory cfgSecurity');
            var acc = $('<div></div>').appendTo(el).accordian({ columns: [{ text: 'Security', glyph: 'fas fa-user-secret', style: { width: '15rem' } }] });
            var pnl = acc.find('div.picAccordian-contents');
            var line = $('<div></div>').appendTo(pnl);
            btnPnl = $('<div class="picBtnPanel btn-panel"></div>').appendTo(pnl);
            btnSave = $('<div id="btnSaveSecurity"></div>').appendTo(btnPnl).actionButton({ text: 'Save Security', icon: '<i class="fas fa-save"></i>' });
            btnSave.on('click', function (e) {
                $(this).addClass('disabled');
                $(this).find('i').addClass('burst-animated');
                // Send this off to the server.
                //$(this).find('span.picButtonText').text('Loading Config...');
                //$.putApiService('/app/config/reload', function (data, status, xhr) {
            });



        },
        dataBind: function (obj) {
            var self = this, o = self.options, el = self.element;
            dataBinder.bind(el, obj);
        }
    });
})(jQuery); // Security


