if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/gallery-md-timespinner/gallery-md-timespinner.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-md-timespinner/gallery-md-timespinner.js",
    code: []
};
_yuitest_coverage["build/gallery-md-timespinner/gallery-md-timespinner.js"].code=["YUI.add('gallery-md-timespinner', function (Y, NAME) {","","/*js lint white: true, nomen: true, maxerr: 50, indent: 4 */","/*gl obal Y*/","/**","* Shows and accepts a time via a set of spinners.","* It can run showing the current time.","* @module gallery-md-timespinner","*/","\"use strict\";","","var Spinner = Y.Spinner,","    Lang = Y.Lang,","    CBX = 'contentBox',","    BBX = 'boundingBox',","    CHANGE = 'Change',","    VALUE = 'value',","    UI = 'ui',","    SHOW_AMPM = 'showAmPm',","    INTERVAL = 'interval',","    SHOW_SECONDS = 'showSeconds',","    RUNNING = 'running',","    AFTER = 'after',","    WRAPPED = 'wrapped',","    HOURS = 'hours',","    MINUTES = 'minutes',","    SECONDS = 'seconds',","    AMPM = 'ampm';","/**"," * The TimeSpinner shows a set of spinners for hour, minute and optionally seconds and AM/PM."," * @class TimeSpinner"," * @extends Widget"," * @uses Y.Spinner, Y.MakeNode"," * @constructor"," * @param cfg {object} (optional) configuration attributes"," */","Y.TimeSpinner = Y.Base.create(","    'timeSpinner',","    Y.Widget,","    [Y.MakeNode],","    {","        /**","         * Reference to the Spinner showing the hours.","         * @property _hourSp","         * @type Y.Spinner","         * @default null","         * @private","         */","        _hourSp: null,","        /**","         * Reference to the Spinner showing the minutes.","         * @property _minSp","         * @type Y.Spinner","         * @default null","         * @private","         */","        _minSp: null,","        /**","         * Reference to the Spinner showing the seconds.","         * @property _secSp","         * @type Y.Spinner","         * @default null","         * @private","         */","        _secSp: null,","        /**","         * Reference to the Spinner showingam/pm.","         * @property _ampmSp","         * @type Y.Spinner","         * @default null","         * @private","         */","        _ampmSp: null,","        /**","         * Reference to the timer created by Y.later that updates the time.","         * @property _timer","         * @type timer object","         * @default null","         * @private","         */","        _timer: null,","        /**","         * Difference in milliseconds in between the current time and that displayed.","         * Used when the timer is running to display times other than the current time.","         * @property _offset","         * @type Number","         * @default 0","         * @private","         */","        _offset: 0,","","        /** Used to store the moment when the timer was stopped","         * @property _frozenTime","         * @type Number (milliseconds)","         * @default 0","         * @private","         */","        _frozenTime: 0,","","        /**","         * Helper factory to make a single Spinner","         * @method _spFact","         * @param which {String} ClassName key for the spinner and strings subkey for its title","         * @param cfg {object} (optional) configuration attribute overrides","         * @param where {Node} (optional) where to render it","         * @return {Spinner} Spinner instance","         * @private","         */","        _spFact: function (which, cfg, where) {","            var sp = new Spinner(Y.merge({","                min: 0,","                max: 59,","                wraparound: true,","                'strings.input': this.get('strings.' + which)","            },cfg)).render(where);","            sp.get(BBX).addClass(this._classNames[which]);","            return sp;","        },","        /**","         * Renders the hours and minutes spinners.","         * The other two, being optional, are rendered when set.","         * @method renderUI","         * @protected","         */","        renderUI: function() {","            var cbx = this.get(CBX);","","            this._hourSp = this._spFact(HOURS, this.get(SHOW_AMPM)?{min:1,max:12}:{max:23}, cbx);","            this._minSp = this._spFact(MINUTES, null, cbx);","        },","        /**","         * Sets the listeners for events from the hours and minutes spinners.","         * @method bindUI","         * @protected","         */","        bindUI: function () {","            this._eventHandles = [","                this._hourSp.after(VALUE + CHANGE, this._afterValueChange, this),","                this._minSp.after(VALUE + CHANGE, this._afterValueChange, this),","                this._minSp.after(WRAPPED, this._afterWrapped, this)","            ];","        },","","        destroy: function () {","            if (this._timer) {","                this._timer.cancel();","            }","            Y.each([].concat(this._eventHandles,this._secondsEventHandles,this._ampmEventHandle), function (eh) {","                if (eh) {","                    eh.detach();","                }","            });","            Y.TimeSpinner.superclass.destroy.call(this);","        },","","        /**","         * Creates or destroys the seconds spinner and attaches/detaches the event listeners.","         * @method _uiSetSeconds","         * @param value {Boolean} whether to show the seconds spinner or not","         * @private","         */","        _uiSetShowSeconds: function(value) {","            if (value) {","                this._secSp = this._spFact(SECONDS,{","                    value: this.get(VALUE).getSeconds()","                });","                this._minSp.get(BBX).insert(this._secSp.get(BBX), AFTER);","                this._secondsEventHandles = [","                    this._secSp.after(VALUE + CHANGE, this._afterValueChange, this),","                    this._secSp.after(WRAPPED, this._afterWrapped, this)","                ];","            } else if (this._secSp) {","                if (this._secSp) {","                    Y.each(this._secondsEventHandles, function (eh) {","                        eh.detach();","                    });","                    this._secSp.destroy();","                    this._secSp = null;","                }","            }","        },","        /**","         * Creates or destroys the am/pm spinner and attaches/detaches the event listeners.","         * @method _uiSetAmpm","         * @param value {Boolean} whether to show the am/pm spinner or not","         * @private","         */","        _uiSetShowAmPm: function (value) {","            if (value) {","                this._ampmSp = this._spFact(AMPM, {","                    max:1,","                    formatter: function(value) {","                        return value?'PM':'AM';","                    },","                    parser: function (value) {","                        switch (value.toUpperCase()) {","                            case 'AM':","                                return 0;","                            case 'PM':","                                return 1;","                            default:","                                return false;","                        }","                    }","                });","                (this._secSp?this._secSp.get(BBX):this._minSp.get(BBX)).insert(this._ampmSp.get(BBX), AFTER);","                this._ampmEventHandle = this._ampmSp.after(VALUE + CHANGE, this._afterValueChange, this);","                this._hourSp.setAttrs({","                    max: 12,","                    min: 1","                });","                this._uiSetValue(this.get(VALUE));","            } else {","                this._hourSp.setAttrs({","                    max: 23,","                    min: 0","                });","                if (this._ampmSp) {","                    this._ampmEventHandle.detach();","                    this._ampmSp.destroy();","                    this._ampmSp = null;","                }","            }","        },","        /**","         * Shows the current value in the set of spinners","         * @method _uiSetValue","         * @param value {Date} value to be shown","         * @param src {String} source of the change in value.","         *        If src===UI, the value comes from the spinners, it needs not be refreshed","         * @private","         */","        _uiSetValue: function (value, src) {","            if (src === UI) {","                return;","            }","            this._setting = true;","            var hours = value.getHours();","            if (this._ampmSp) {","                this._hourSp.set(VALUE, (hours % 12) || 12);","                this._ampmSp.set(VALUE, hours >= 12?1:0);","            } else {","                this._hourSp.set(VALUE, hours);","            }","            this._minSp.set(VALUE, value.getMinutes());","            if (this._secSp) {","                this._secSp.set(VALUE, value.getSeconds());","            }","            this._setting = false;","        },","","        /**","         * Sets the interval for refreshing the display","         * @method _uiSetInterval","         * @param value {number} milliseconds in between refreshes","         * @private","         */","        _uiSetInterval: function (value) {","            if (this._timer) {","                this._timer.cancel();","            }","            if (value) {","                this._timer = Y.later(value, this, this._updateTime, [], true);","            }","        },","        /**","         * Sets the timer running.","         * @method _uiSetRunning","         * @param value {Boolean} run or not","         * @private","         */","        _uiSetRunning: function (value) {","            this._uiSetInterval(value && this.get(INTERVAL));","            this._frozenTime = Date.now();","        },","","        /**","         * Listener for a change in any of the spinners, sets the value.","         * @method _afterValueChange","         * @private","         */","        _afterValueChange: function () {","            if (this._setting) {","                return;","            }","            var d = new Date();","            d.setHours((this._hourSp.get(VALUE) + (this._ampmSp? 12 * this._ampmSp.get(VALUE):0)) % 24);","            d.setMinutes(this._minSp.get(VALUE));","            d.setSeconds(this._secSp?this._secSp.get(VALUE):0);","            this.set(VALUE, d, {src: UI});","        },","","        /**","         * Listener for the wrapped event of the spinners to propagate","         * the changes from seconds to minutes and minutes to hours.","         * @method","         * @param ev {EventFacade} to find out which one wrapped and which way","         * @private","         */","        _afterWrapped: function (ev) {","            var dir = ev.newVal > ev.prevVal?-1:1;","            if (ev.target === this._secSp) {","                this._minSp.set(VALUE, this._minSp.get(VALUE) + dir);","            }","            if (ev.target === this._minSp) {","                this._hourSp.set(VALUE, this._hourSp.get(VALUE) + dir);","            }","        },","","        /**","         * Callback for the interval timer to update the time shown","         * @method _updateTime","         * @private","         */","        _updateTime: function() {","            this._uiSetValue(this._getTime());","        },","        /**","         * Getter for the time value.  It returns the current time minus the offset","         * or the time when it was stopped.","         * @method _getTime","         * @return {Date} Time shown","         * @private","         */","        _getTime: function() {","            if (this.get(RUNNING)) {","                return new Date(Date.now() - this._offset);","            } else {","                return new Date(this._frozenTime - this._offset);","            }","        },","        /**","         * Setter for the time value.","         * It calculates and saves the offset in between the current time and that set.","         * @method _setTime","         * @param value {Date} time to be shown","         * @private","         */","        _setTime: function (value) {","            this._offset = Date.now() - value.getTime();","            return value;","        },","","        /**","         * Helper method to set the timer running.","         * Same as <code>this.set('running', true);</code>","         * @method start","         */","        start: function () {","            this.set(RUNNING, true);","        },","        /**","         * Helper method to stop the timer.","         * Same as <code>this.set('running', false);</code>","         * @method stop","         */","        stop: function () {","            this.set(RUNNING, false);","        }","    },","    {","        _CLASS_NAMES: [HOURS, MINUTES, SECONDS, AMPM],","        ATTRS: {","            /**","             * Whether to show the am/pm indicator or show a 24 hours timer.","             * @attribute showAmPm","             * @type Boolean","             * @default false","             */","            showAmPm : {","                value:false,","                validator: Lang.isBoolean","            },","            /**","             * Whether to show the seconds indicator","             * @attribute showSeconds","             * @type Boolean","             * @default true","             */","            showSeconds:{","                value:true,","                validator: Lang.isBoolean","            },","            /**","             * Value of the timer","             * @attribute value","             * @type Date","             * @default time at initialization or current time if running","             */","            value: {","                valueFn: function() {","                    return new Date();","                },","                validator: function (value) {","                    return value instanceof Date;","                },","                getter:'_getTime',","                setter:'_setTime'","            },","","            /**","             * How often to refresh the time displayed","             * @attribute interval","             * @type Number (milliseconds)","             * @default 500","             */","            interval: {","                value: 500,","                validator: Lang.isNumber","            },","","            /**","             * Whether the timer is running.","             * @attribute running","             * @type Boolean","             * @default true","             */","            running: {","                value: true,","                validator: Lang.isBoolean","            },","","            /**","             * Set of localizable strings to be used as tooltips on the spinners.","             * @attribute strings","             */","            strings: {","                value: {","                    hours:HOURS,","                    minutes:MINUTES,","                    seconds: SECONDS,","                    ampm: 'am/pm'","                }","            }","        },","        _ATTRS_2_UI: {","            BIND: [INTERVAL, RUNNING, SHOW_AMPM, SHOW_SECONDS, VALUE],","            SYNC: [INTERVAL, RUNNING, SHOW_AMPM, SHOW_SECONDS, VALUE]","        }","    }",");","","","}, '@VERSION@', {\"requires\": [\"gallery-md-spinner\", \"gallery-makenode\"]});"];
_yuitest_coverage["build/gallery-md-timespinner/gallery-md-timespinner.js"].lines = {"1":0,"10":0,"12":0,"37":0,"110":0,"116":0,"117":0,"126":0,"128":0,"129":0,"137":0,"145":0,"146":0,"148":0,"149":0,"150":0,"153":0,"163":0,"164":0,"167":0,"168":0,"172":0,"173":0,"174":0,"175":0,"177":0,"178":0,"189":0,"190":0,"193":0,"196":0,"198":0,"200":0,"202":0,"206":0,"207":0,"208":0,"212":0,"214":0,"218":0,"219":0,"220":0,"221":0,"234":0,"235":0,"237":0,"238":0,"239":0,"240":0,"241":0,"243":0,"245":0,"246":0,"247":0,"249":0,"259":0,"260":0,"262":0,"263":0,"273":0,"274":0,"283":0,"284":0,"286":0,"287":0,"288":0,"289":0,"290":0,"301":0,"302":0,"303":0,"305":0,"306":0,"316":0,"326":0,"327":0,"329":0,"340":0,"341":0,"350":0,"358":0,"392":0,"395":0};
_yuitest_coverage["build/gallery-md-timespinner/gallery-md-timespinner.js"].functions = {"_spFact:109":0,"renderUI:125":0,"bindUI:136":0,"(anonymous 2):148":0,"destroy:144":0,"(anonymous 3):174":0,"_uiSetShowSeconds:162":0,"formatter:192":0,"parser:195":0,"_uiSetShowAmPm:188":0,"_uiSetValue:233":0,"_uiSetInterval:258":0,"_uiSetRunning:272":0,"_afterValueChange:282":0,"_afterWrapped:300":0,"_updateTime:315":0,"_getTime:325":0,"_setTime:339":0,"start:349":0,"stop:357":0,"valueFn:391":0,"validator:394":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-md-timespinner/gallery-md-timespinner.js"].coveredLines = 83;
_yuitest_coverage["build/gallery-md-timespinner/gallery-md-timespinner.js"].coveredFunctions = 23;
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 1);
YUI.add('gallery-md-timespinner', function (Y, NAME) {

/*js lint white: true, nomen: true, maxerr: 50, indent: 4 */
/*gl obal Y*/
/**
* Shows and accepts a time via a set of spinners.
* It can run showing the current time.
* @module gallery-md-timespinner
*/
_yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 10);
"use strict";

_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 12);
var Spinner = Y.Spinner,
    Lang = Y.Lang,
    CBX = 'contentBox',
    BBX = 'boundingBox',
    CHANGE = 'Change',
    VALUE = 'value',
    UI = 'ui',
    SHOW_AMPM = 'showAmPm',
    INTERVAL = 'interval',
    SHOW_SECONDS = 'showSeconds',
    RUNNING = 'running',
    AFTER = 'after',
    WRAPPED = 'wrapped',
    HOURS = 'hours',
    MINUTES = 'minutes',
    SECONDS = 'seconds',
    AMPM = 'ampm';
/**
 * The TimeSpinner shows a set of spinners for hour, minute and optionally seconds and AM/PM.
 * @class TimeSpinner
 * @extends Widget
 * @uses Y.Spinner, Y.MakeNode
 * @constructor
 * @param cfg {object} (optional) configuration attributes
 */
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 37);
Y.TimeSpinner = Y.Base.create(
    'timeSpinner',
    Y.Widget,
    [Y.MakeNode],
    {
        /**
         * Reference to the Spinner showing the hours.
         * @property _hourSp
         * @type Y.Spinner
         * @default null
         * @private
         */
        _hourSp: null,
        /**
         * Reference to the Spinner showing the minutes.
         * @property _minSp
         * @type Y.Spinner
         * @default null
         * @private
         */
        _minSp: null,
        /**
         * Reference to the Spinner showing the seconds.
         * @property _secSp
         * @type Y.Spinner
         * @default null
         * @private
         */
        _secSp: null,
        /**
         * Reference to the Spinner showingam/pm.
         * @property _ampmSp
         * @type Y.Spinner
         * @default null
         * @private
         */
        _ampmSp: null,
        /**
         * Reference to the timer created by Y.later that updates the time.
         * @property _timer
         * @type timer object
         * @default null
         * @private
         */
        _timer: null,
        /**
         * Difference in milliseconds in between the current time and that displayed.
         * Used when the timer is running to display times other than the current time.
         * @property _offset
         * @type Number
         * @default 0
         * @private
         */
        _offset: 0,

        /** Used to store the moment when the timer was stopped
         * @property _frozenTime
         * @type Number (milliseconds)
         * @default 0
         * @private
         */
        _frozenTime: 0,

        /**
         * Helper factory to make a single Spinner
         * @method _spFact
         * @param which {String} ClassName key for the spinner and strings subkey for its title
         * @param cfg {object} (optional) configuration attribute overrides
         * @param where {Node} (optional) where to render it
         * @return {Spinner} Spinner instance
         * @private
         */
        _spFact: function (which, cfg, where) {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "_spFact", 109);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 110);
var sp = new Spinner(Y.merge({
                min: 0,
                max: 59,
                wraparound: true,
                'strings.input': this.get('strings.' + which)
            },cfg)).render(where);
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 116);
sp.get(BBX).addClass(this._classNames[which]);
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 117);
return sp;
        },
        /**
         * Renders the hours and minutes spinners.
         * The other two, being optional, are rendered when set.
         * @method renderUI
         * @protected
         */
        renderUI: function() {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "renderUI", 125);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 126);
var cbx = this.get(CBX);

            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 128);
this._hourSp = this._spFact(HOURS, this.get(SHOW_AMPM)?{min:1,max:12}:{max:23}, cbx);
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 129);
this._minSp = this._spFact(MINUTES, null, cbx);
        },
        /**
         * Sets the listeners for events from the hours and minutes spinners.
         * @method bindUI
         * @protected
         */
        bindUI: function () {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "bindUI", 136);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 137);
this._eventHandles = [
                this._hourSp.after(VALUE + CHANGE, this._afterValueChange, this),
                this._minSp.after(VALUE + CHANGE, this._afterValueChange, this),
                this._minSp.after(WRAPPED, this._afterWrapped, this)
            ];
        },

        destroy: function () {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "destroy", 144);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 145);
if (this._timer) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 146);
this._timer.cancel();
            }
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 148);
Y.each([].concat(this._eventHandles,this._secondsEventHandles,this._ampmEventHandle), function (eh) {
                _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "(anonymous 2)", 148);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 149);
if (eh) {
                    _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 150);
eh.detach();
                }
            });
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 153);
Y.TimeSpinner.superclass.destroy.call(this);
        },

        /**
         * Creates or destroys the seconds spinner and attaches/detaches the event listeners.
         * @method _uiSetSeconds
         * @param value {Boolean} whether to show the seconds spinner or not
         * @private
         */
        _uiSetShowSeconds: function(value) {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "_uiSetShowSeconds", 162);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 163);
if (value) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 164);
this._secSp = this._spFact(SECONDS,{
                    value: this.get(VALUE).getSeconds()
                });
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 167);
this._minSp.get(BBX).insert(this._secSp.get(BBX), AFTER);
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 168);
this._secondsEventHandles = [
                    this._secSp.after(VALUE + CHANGE, this._afterValueChange, this),
                    this._secSp.after(WRAPPED, this._afterWrapped, this)
                ];
            } else {_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 172);
if (this._secSp) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 173);
if (this._secSp) {
                    _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 174);
Y.each(this._secondsEventHandles, function (eh) {
                        _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "(anonymous 3)", 174);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 175);
eh.detach();
                    });
                    _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 177);
this._secSp.destroy();
                    _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 178);
this._secSp = null;
                }
            }}
        },
        /**
         * Creates or destroys the am/pm spinner and attaches/detaches the event listeners.
         * @method _uiSetAmpm
         * @param value {Boolean} whether to show the am/pm spinner or not
         * @private
         */
        _uiSetShowAmPm: function (value) {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "_uiSetShowAmPm", 188);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 189);
if (value) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 190);
this._ampmSp = this._spFact(AMPM, {
                    max:1,
                    formatter: function(value) {
                        _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "formatter", 192);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 193);
return value?'PM':'AM';
                    },
                    parser: function (value) {
                        _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "parser", 195);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 196);
switch (value.toUpperCase()) {
                            case 'AM':
                                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 198);
return 0;
                            case 'PM':
                                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 200);
return 1;
                            default:
                                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 202);
return false;
                        }
                    }
                });
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 206);
(this._secSp?this._secSp.get(BBX):this._minSp.get(BBX)).insert(this._ampmSp.get(BBX), AFTER);
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 207);
this._ampmEventHandle = this._ampmSp.after(VALUE + CHANGE, this._afterValueChange, this);
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 208);
this._hourSp.setAttrs({
                    max: 12,
                    min: 1
                });
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 212);
this._uiSetValue(this.get(VALUE));
            } else {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 214);
this._hourSp.setAttrs({
                    max: 23,
                    min: 0
                });
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 218);
if (this._ampmSp) {
                    _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 219);
this._ampmEventHandle.detach();
                    _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 220);
this._ampmSp.destroy();
                    _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 221);
this._ampmSp = null;
                }
            }
        },
        /**
         * Shows the current value in the set of spinners
         * @method _uiSetValue
         * @param value {Date} value to be shown
         * @param src {String} source of the change in value.
         *        If src===UI, the value comes from the spinners, it needs not be refreshed
         * @private
         */
        _uiSetValue: function (value, src) {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "_uiSetValue", 233);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 234);
if (src === UI) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 235);
return;
            }
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 237);
this._setting = true;
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 238);
var hours = value.getHours();
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 239);
if (this._ampmSp) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 240);
this._hourSp.set(VALUE, (hours % 12) || 12);
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 241);
this._ampmSp.set(VALUE, hours >= 12?1:0);
            } else {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 243);
this._hourSp.set(VALUE, hours);
            }
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 245);
this._minSp.set(VALUE, value.getMinutes());
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 246);
if (this._secSp) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 247);
this._secSp.set(VALUE, value.getSeconds());
            }
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 249);
this._setting = false;
        },

        /**
         * Sets the interval for refreshing the display
         * @method _uiSetInterval
         * @param value {number} milliseconds in between refreshes
         * @private
         */
        _uiSetInterval: function (value) {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "_uiSetInterval", 258);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 259);
if (this._timer) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 260);
this._timer.cancel();
            }
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 262);
if (value) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 263);
this._timer = Y.later(value, this, this._updateTime, [], true);
            }
        },
        /**
         * Sets the timer running.
         * @method _uiSetRunning
         * @param value {Boolean} run or not
         * @private
         */
        _uiSetRunning: function (value) {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "_uiSetRunning", 272);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 273);
this._uiSetInterval(value && this.get(INTERVAL));
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 274);
this._frozenTime = Date.now();
        },

        /**
         * Listener for a change in any of the spinners, sets the value.
         * @method _afterValueChange
         * @private
         */
        _afterValueChange: function () {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "_afterValueChange", 282);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 283);
if (this._setting) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 284);
return;
            }
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 286);
var d = new Date();
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 287);
d.setHours((this._hourSp.get(VALUE) + (this._ampmSp? 12 * this._ampmSp.get(VALUE):0)) % 24);
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 288);
d.setMinutes(this._minSp.get(VALUE));
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 289);
d.setSeconds(this._secSp?this._secSp.get(VALUE):0);
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 290);
this.set(VALUE, d, {src: UI});
        },

        /**
         * Listener for the wrapped event of the spinners to propagate
         * the changes from seconds to minutes and minutes to hours.
         * @method
         * @param ev {EventFacade} to find out which one wrapped and which way
         * @private
         */
        _afterWrapped: function (ev) {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "_afterWrapped", 300);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 301);
var dir = ev.newVal > ev.prevVal?-1:1;
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 302);
if (ev.target === this._secSp) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 303);
this._minSp.set(VALUE, this._minSp.get(VALUE) + dir);
            }
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 305);
if (ev.target === this._minSp) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 306);
this._hourSp.set(VALUE, this._hourSp.get(VALUE) + dir);
            }
        },

        /**
         * Callback for the interval timer to update the time shown
         * @method _updateTime
         * @private
         */
        _updateTime: function() {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "_updateTime", 315);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 316);
this._uiSetValue(this._getTime());
        },
        /**
         * Getter for the time value.  It returns the current time minus the offset
         * or the time when it was stopped.
         * @method _getTime
         * @return {Date} Time shown
         * @private
         */
        _getTime: function() {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "_getTime", 325);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 326);
if (this.get(RUNNING)) {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 327);
return new Date(Date.now() - this._offset);
            } else {
                _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 329);
return new Date(this._frozenTime - this._offset);
            }
        },
        /**
         * Setter for the time value.
         * It calculates and saves the offset in between the current time and that set.
         * @method _setTime
         * @param value {Date} time to be shown
         * @private
         */
        _setTime: function (value) {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "_setTime", 339);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 340);
this._offset = Date.now() - value.getTime();
            _yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 341);
return value;
        },

        /**
         * Helper method to set the timer running.
         * Same as <code>this.set('running', true);</code>
         * @method start
         */
        start: function () {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "start", 349);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 350);
this.set(RUNNING, true);
        },
        /**
         * Helper method to stop the timer.
         * Same as <code>this.set('running', false);</code>
         * @method stop
         */
        stop: function () {
            _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "stop", 357);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 358);
this.set(RUNNING, false);
        }
    },
    {
        _CLASS_NAMES: [HOURS, MINUTES, SECONDS, AMPM],
        ATTRS: {
            /**
             * Whether to show the am/pm indicator or show a 24 hours timer.
             * @attribute showAmPm
             * @type Boolean
             * @default false
             */
            showAmPm : {
                value:false,
                validator: Lang.isBoolean
            },
            /**
             * Whether to show the seconds indicator
             * @attribute showSeconds
             * @type Boolean
             * @default true
             */
            showSeconds:{
                value:true,
                validator: Lang.isBoolean
            },
            /**
             * Value of the timer
             * @attribute value
             * @type Date
             * @default time at initialization or current time if running
             */
            value: {
                valueFn: function() {
                    _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "valueFn", 391);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 392);
return new Date();
                },
                validator: function (value) {
                    _yuitest_coverfunc("build/gallery-md-timespinner/gallery-md-timespinner.js", "validator", 394);
_yuitest_coverline("build/gallery-md-timespinner/gallery-md-timespinner.js", 395);
return value instanceof Date;
                },
                getter:'_getTime',
                setter:'_setTime'
            },

            /**
             * How often to refresh the time displayed
             * @attribute interval
             * @type Number (milliseconds)
             * @default 500
             */
            interval: {
                value: 500,
                validator: Lang.isNumber
            },

            /**
             * Whether the timer is running.
             * @attribute running
             * @type Boolean
             * @default true
             */
            running: {
                value: true,
                validator: Lang.isBoolean
            },

            /**
             * Set of localizable strings to be used as tooltips on the spinners.
             * @attribute strings
             */
            strings: {
                value: {
                    hours:HOURS,
                    minutes:MINUTES,
                    seconds: SECONDS,
                    ampm: 'am/pm'
                }
            }
        },
        _ATTRS_2_UI: {
            BIND: [INTERVAL, RUNNING, SHOW_AMPM, SHOW_SECONDS, VALUE],
            SYNC: [INTERVAL, RUNNING, SHOW_AMPM, SHOW_SECONDS, VALUE]
        }
    }
);


}, '@VERSION@', {"requires": ["gallery-md-spinner", "gallery-makenode"]});
