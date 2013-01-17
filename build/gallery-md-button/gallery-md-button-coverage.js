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
_yuitest_coverage["build/gallery-md-button/gallery-md-button.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-md-button/gallery-md-button.js",
    code: []
};
_yuitest_coverage["build/gallery-md-button/gallery-md-button.js"].code=["YUI.add('gallery-md-button', function (Y, NAME) {","","/**"," * Provides a better button object"," * @module gallery-md-button"," */"," \"use strict\";","","var Lang = Y.Lang,","    EVENT_PRESS = 'press',","    CALLBACK = 'callback',","    DESELECTED_CALLBACK = 'deselectedCallback',","    SELECTED = 'selected',","    BBX = 'boundingBox',","    CBX = 'contentBox',","    DEFAULT = 'default',","    DISABLED = 'disabled',","    HREF = 'href',","    ICON = 'icon',","    TITLE = 'title',","    VALUE = 'value',","    LABEL = 'label',","    INNER_HTML = 'innerHTML',","    PUSH = 'push',","    SUBMIT = 'submit',","    RESET = 'reset',","    TYPE = 'type',","    LEFT = 'left',","    RIGHT = 'right';","","/**"," * The Button class provides a fancier type of button."," * @class Button"," * @extends Y.Widget"," * @uses Y.MakeNode"," * @constructor"," * @param cfg {object} Configuration Attributes"," */","","Y.Button = Y.Base.create(","    'button',","    Y.Widget,","    [Y.MakeNode],","    {","","        /**","         * Overrides the boundingBox template to make it an anchor","         * @property BOUNDING_TEMPLATE","         * @type string","         * @default '&lt;a /&gt;'","         * @private","         */","        BOUNDING_TEMPLATE: '<a />',","","        /**","         * Overrides the contentBox template to prevent a content box from being drawn","         * @property CONTENT_TEMPLATE","         * @type null","         * @default null","         * @private","         */","        CONTENT_TEMPLATE: null,","","        /**","         * Holds the previous value of the className assigned through the <a href=\"#config_icon\"><code>icon</code></a>","         * attribute for easy removal","         * (Eventually it will be dropped, see: http://yuilibrary.com/projects/yui3/ticket/2530486)","         * @property _prevIconClassName","         * @type string","         * @private","         */","        _prevIconClassName:'',","","","        renderUI: function () {","            this.get(BBX).append(this._makeNode());","            this._locateNodes(LABEL, ICON);","        },","","","        /**","         * Removes the pressed class.","         * MouseUp is listened to at the document body level since the cursor might have moved","         * away from the pressed button when released.","         * @method _afterDocumentMouseup","         * @private","         */","        _afterDocumentMouseup: function () {","            this.get(BBX).removeClass(this._classNames.pressed);","        },","","        /**","         * Adds the pressed class to bounding box","         * @method _afterBoundingBoxMousedown","         * @private","         */","        _afterBoundingBoxMousedown: function () {","            if (!this.get(DISABLED)) {","                this.get(BBX).addClass(this._classNames.pressed);","            }","        },","        /**","         * Sets the title attribute to the bounding box","         * @method _uiSetTitle","         * @param title {String}","         * @private","         */","        _uiSetTitle: function (title) {","            this.get(BBX).set(TITLE, title);","        },","        /**","         * Updates the default class on the bounding box","         * @method _uiSetDefault","         * @param state {boolean}","         * @private","         */","        _uiSetDefault: function (state) {","            var bbx = this.get(BBX);","            if (state) {","                bbx.addClass(this._classNames[DEFAULT]);","                bbx.setAttribute(DEFAULT, DEFAULT);","            } else {","                bbx.removeClass(this._classNames[DEFAULT]);","                bbx.set(DEFAULT, '');","            }","        },","        /**","         * Sets the icon class for the bounding box","         *","         * @method _uiSetIcon","         * @param value {String} class suffix (always prefixed with <code>yui3-button-icon-</code>)","         * @private","         */","        _uiSetIcon: function (value) {","            value = value || 'none';","            var newName = this._classNames[ICON] + '-' + value;","            this.get(BBX).replaceClass(","                this._prevIconClassName,","                newName","            );","            this._prevIconClassName = newName;","        },","        /**","         * Sets the position of the icon relative to the label.","         * Spans for icons are always set at either side,","         * this method changes a classname in the bounding box","         * so that one of them is hidden","         * @method _uiSetIconPosition","         * @param value {String} 'left' or 'right'","         * @private","         */","","        _uiSetIconPosition: function (value) {","            var cn = this._classNames;","            this.get(CBX).replaceClass(cn[ICON +(value===LEFT?RIGHT:LEFT)],cn[ICON + value]);","        },","","        /**","         * Sets the icon class for the bounding box","         *","         * @method _uiSetLabel","         * @param value {String or null} label to be set or null for none","         * @private","         */","        _uiSetLabel: function (value) {","            if (!value || value === '') {","                this.get(BBX).addClass(this._classNames.noLabel);","            } else {","                this.get(BBX).removeClass(this._classNames.noLabel);","            }","            this._labelNode.setContent(value || '');","        },","        /**","         * Sets the href attribute on the bounding box","         * @method _uiSetHref","         * @param value {String} url of link to be set.","         * @private","         */","        _uiSetHref: function (value) {","            this.get(BBX).set(HREF, value);","        },","","        /**","         * Default click event handler","         * @method _afterBoundingBoxClick","         * @param ev {Event Facade}","         * @private","         */","        _afterBoundingBoxClick: function (ev) {","            var href = this.get(HREF);","","            if (this.get(DISABLED)) {","                ev.preventDefault();","                return;","            }","","            if (!href || href === '#') {","                ev.preventDefault();","            }","            this.fire(EVENT_PRESS, {","                click: ev","            });","        },","","        /**","         * Default press callback function","         * @method _defPressFn","         * @param ev {EventFacade}","         * @private","         */","        _defPressFn: function (ev) {","            if (!this.get(DISABLED)) {","                var fn = this.get(CALLBACK) || this._callbackFromType();","                if (fn) {","                    fn.apply(this, ev);","                }","            }","        },","","        /**","         * Returns a function based on the type of button. Form buttons such","         *   as Submit and Reset are attached to their parent form if one is","         *   found.  Otherwise null is returned.","         *","         * @method _callbackFromType","         * @private","         * @return Function or null","         */","        _callbackFromType: function () {","            var bbx = this.get(BBX),","                frm = bbx.ancestor('form');","","            if (frm) {","                switch (this.get(TYPE)) {","                case SUBMIT:","                    return Y.bind(frm[SUBMIT], frm);","                case RESET:","                    return Y.bind(frm[RESET], frm);","                }","            }","            return null;","        }","","","    },","    {","        /**","         * Constant for 'push' <a href=\"#config_type\">type</a> button (the default)","         * @property Y.Button.PUSH","         * @type String","         * @default 'push'","         * @static","         */","        PUSH:PUSH,","        /**","         * Constant for 'submit' <a href=\"#config_type\">type</a> button","         * @property Y.Button.SUBMIT","         * @type String","         * @default 'submit'","         * @static","         */","        SUBMIT:SUBMIT,","        /**","         * Constant for 'reset' <a href=\"#config_type\">type</a> button (the default)","         * @property Y.Button.RESET","         * @type String","         * @default 'reset'","         * @static","         */","        RESET:RESET,","        /**","         * Constant to set the <a href=\"#config_iconPosition\">iconPosition</a> to be to the left of the label","         * @property Y.Button.LEFT","         * @type String","         * @default 'left'","         * @static","         */","        LEFT: LEFT,","        /**","         * Constant to set the <a href=\"#config_iconPosition\">iconPosition</a> to be to the right of the label","         * @property Y.Button.RIGHT","         * @type String","         * @default 'right'","         * @static","         */","        RIGHT: RIGHT,","        /**","         * Template to use by the MakeNode extension","         * @property _TEMPLATE","         * @type String","         * @static","         * @protected","         */","        _TEMPLATE: [","            '<span class=\"{c icon}\"></span>',","            '<span class=\"{c label}\">{@ label}</span>'","        ].join('\\n'),","","        /**","         * Class name suffixes for CSS classNames used in the widget","         * @property Y.Button._CLASS_NAMES","         * @type [Strings]","         * @static","         * @protected","         */","        _CLASS_NAMES: ['pressed', DEFAULT, 'no-label', LABEL, ICON, ICON + LEFT, ICON + RIGHT],","        /**","         * DOM events to be listened to, used by the MakeNode extension","         * @property Y.Button._EVENTS","         * @type Object","         * @static","         * @protected","         */","        _EVENTS: {","            boundingBox: ['click','mousedown'],","            document: 'mouseup'","        },","        _PUBLISH: {","            press: {","                defaultFn: \"_defPressFn\"","            }","        },","        ATTRS: {","            /**","             * Label to be shown on the button","             * @attribute label","             * @type string","             * @default ''","             */","            label: {","                value: '',","                validator: Lang.isString","            },","            /**","             * Function to be called on button click","             * @attribute callback","             * @type Function","             */","            callback: {","                validator: Lang.isFunction","            },","            /**","             * Button is to be the default button","             * @attribute default","             * @type Boolean","             * @default false","             */","            'default': {","                value: false,","                validator: Lang.isBoolean","            },","            /**","             * Suffix to be added to the <code>yui3-button-icon-</code> class to","             * set on the button","             * @attribute icon","             * @type string or null for none","             * @default null","             */","            icon: {","                value: null,","                validator: function(value) {","                    return Lang.isString(value) || Lang.isNull(value);","                }","            },","            /**","             * Whether the icon should go to the left or to the right of the label","             * @attribute iconPosition","             * @type String ('left' or 'right')","             * @default 'left'","             */","            iconPosition : {","                value : LEFT,","                validator: function (value) {","                    return value === LEFT || value === RIGHT;","                }","            },","            /**","             * href property to set on the button A element","             * @attribute href","             * @default null","             */","            href: {","                value: null","            },","            /**","             * Title (tooltip) to set on the button element","             * @attribute title","             * @type string","             */","            title: {","                value: '',","                validator: Lang.isString","            },","            /**","             * Defines the button type. One of push, submit or reset.  Any value but submit or reset will assume push.","             * @attribute type","             * @type string","             * @default push","             */","            type: {","                value: PUSH,","                validator: Lang.isString,","                lazyAdd: false","            }","        },","        _ATTRS_2_UI: {","            BIND: [LABEL, ICON, TITLE, HREF, DEFAULT, 'iconPosition'],","            SYNC: [LABEL, ICON, TITLE, HREF, DEFAULT, 'iconPosition']","        },","        /**","         * HTML Parser assumes srcNode is either a &lt;button&gt; or","         *   &lt;input type=\"submit|reset\"&gt;","         */","        HTML_PARSER: {","","            disabled: function (srcNode) {","                return !!srcNode.get(DISABLED);","            },","","            label: function (srcNode) {","                if (srcNode.getAttribute(VALUE)) {","                    return srcNode.getAttribute(VALUE);","                }","                if (srcNode.get(INNER_HTML)) {","                    return srcNode.get(INNER_HTML);","                }","","                // default form button labels based on type","                if (srcNode.get('tagName') === 'INPUT') {","                    switch (srcNode.get(TYPE)) {","                    case RESET:","                        return RESET;","                    case SUBMIT:","                        return SUBMIT;","                    }","                }","","                return null;","            },","","            href: function (srcNode) {","                var href = srcNode.getAttribute(HREF);","","                if (href) {","                    return href;","                }","","                return null;","            },","","            type: function (srcNode) {","                var type = srcNode.getAttribute(TYPE);","","                if (type) {","                    return type.toLowerCase();","                }","                return null;","            },","","            title: function (srcNode) {","                if (srcNode.getAttribute(TITLE)) {","                    return srcNode.getAttribute(TITLE);","                }","                if (srcNode.getAttribute(VALUE)) {","                    return srcNode.getAttribute(VALUE);","                }","                if (srcNode.get(INNER_HTML)) {","                    return srcNode.get(INNER_HTML);","                }","                return null;","            }","","        }","    }",");","","/**"," * The ButtonToggle class provides a two-state button"," * @class ButtonToggle"," * @extends Y.Button"," * @constructor"," * @param cfg {object} Configuration attributes"," */","","Y.ButtonToggle = Y.Base.create(","    'buttonToggle',","    Y.Button,","    [],","    {","        /**","         * Overrides Button's <a href=\"Button.html#method__defPressFn\">_defPressFn</a>","         * to produce the two-state effect","         * @method _defPressFn","         * @param ev {EventFacade}","         * @private","         */","        _defPressFn : function(ev) {","            if (!this.get(DISABLED)) {","                var newSelected = this.get(SELECTED)?0:1,","                    fn = this.get(newSelected?CALLBACK:DESELECTED_CALLBACK);","                if (fn) {","                    fn.apply(this, ev);","                }","                this.set(SELECTED, newSelected);","                if (!this.ancestor) {","                    if (newSelected) {","                        this.get(BBX).addClass(this._classNames[SELECTED]);","                    } else {","                        this.get(BBX).removeClass(this._classNames[SELECTED]);","                    }","                }","            }","        }","    },","    {","        /**","         * Class name suffixes for CSS classNames used in the widget.","         * Produces the yui3-button-toggle-selected className to be added","         * to the button if not within a ButtonGroup","         * @property Y.ButtonToggle._CLASS_NAMES","         * @type [Strings]","         * @static","         * @protected","         */","         _CLASS_NAMES:[SELECTED],","        ATTRS : {","            /**","             * Function to be called when the toggle is deselected","             * @attribute deselectedCallback","             * @type function or null","             * @default null","             */","            deselectedCallback : {","                value: null,","                validator : function (value) {","                    return Lang.isFunction(value) || Lang.isNull(value);","                }","            }","        }","    }",");","","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"widget\", \"gallery-makenode\"], \"skinnable\": true});"];
_yuitest_coverage["build/gallery-md-button/gallery-md-button.js"].lines = {"1":0,"7":0,"9":0,"40":0,"76":0,"77":0,"89":0,"98":0,"99":0,"109":0,"118":0,"119":0,"120":0,"121":0,"123":0,"124":0,"135":0,"136":0,"137":0,"141":0,"154":0,"155":0,"166":0,"167":0,"169":0,"171":0,"180":0,"190":0,"192":0,"193":0,"194":0,"197":0,"198":0,"200":0,"212":0,"213":0,"214":0,"215":0,"230":0,"233":0,"234":0,"236":0,"238":0,"241":0,"362":0,"374":0,"417":0,"421":0,"422":0,"424":0,"425":0,"429":0,"430":0,"432":0,"434":0,"438":0,"442":0,"444":0,"445":0,"448":0,"452":0,"454":0,"455":0,"457":0,"461":0,"462":0,"464":0,"465":0,"467":0,"468":0,"470":0,"485":0,"498":0,"499":0,"501":0,"502":0,"504":0,"505":0,"506":0,"507":0,"509":0,"536":0};
_yuitest_coverage["build/gallery-md-button/gallery-md-button.js"].functions = {"renderUI:75":0,"_afterDocumentMouseup:88":0,"_afterBoundingBoxMousedown:97":0,"_uiSetTitle:108":0,"_uiSetDefault:117":0,"_uiSetIcon:134":0,"_uiSetIconPosition:153":0,"_uiSetLabel:165":0,"_uiSetHref:179":0,"_afterBoundingBoxClick:189":0,"_defPressFn:211":0,"_callbackFromType:229":0,"validator:361":0,"validator:373":0,"disabled:416":0,"label:420":0,"href:441":0,"type:451":0,"title:460":0,"_defPressFn:497":0,"validator:535":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-md-button/gallery-md-button.js"].coveredLines = 82;
_yuitest_coverage["build/gallery-md-button/gallery-md-button.js"].coveredFunctions = 22;
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 1);
YUI.add('gallery-md-button', function (Y, NAME) {

/**
 * Provides a better button object
 * @module gallery-md-button
 */
 _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 7);
"use strict";

_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 9);
var Lang = Y.Lang,
    EVENT_PRESS = 'press',
    CALLBACK = 'callback',
    DESELECTED_CALLBACK = 'deselectedCallback',
    SELECTED = 'selected',
    BBX = 'boundingBox',
    CBX = 'contentBox',
    DEFAULT = 'default',
    DISABLED = 'disabled',
    HREF = 'href',
    ICON = 'icon',
    TITLE = 'title',
    VALUE = 'value',
    LABEL = 'label',
    INNER_HTML = 'innerHTML',
    PUSH = 'push',
    SUBMIT = 'submit',
    RESET = 'reset',
    TYPE = 'type',
    LEFT = 'left',
    RIGHT = 'right';

/**
 * The Button class provides a fancier type of button.
 * @class Button
 * @extends Y.Widget
 * @uses Y.MakeNode
 * @constructor
 * @param cfg {object} Configuration Attributes
 */

_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 40);
Y.Button = Y.Base.create(
    'button',
    Y.Widget,
    [Y.MakeNode],
    {

        /**
         * Overrides the boundingBox template to make it an anchor
         * @property BOUNDING_TEMPLATE
         * @type string
         * @default '&lt;a /&gt;'
         * @private
         */
        BOUNDING_TEMPLATE: '<a />',

        /**
         * Overrides the contentBox template to prevent a content box from being drawn
         * @property CONTENT_TEMPLATE
         * @type null
         * @default null
         * @private
         */
        CONTENT_TEMPLATE: null,

        /**
         * Holds the previous value of the className assigned through the <a href="#config_icon"><code>icon</code></a>
         * attribute for easy removal
         * (Eventually it will be dropped, see: http://yuilibrary.com/projects/yui3/ticket/2530486)
         * @property _prevIconClassName
         * @type string
         * @private
         */
        _prevIconClassName:'',


        renderUI: function () {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "renderUI", 75);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 76);
this.get(BBX).append(this._makeNode());
            _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 77);
this._locateNodes(LABEL, ICON);
        },


        /**
         * Removes the pressed class.
         * MouseUp is listened to at the document body level since the cursor might have moved
         * away from the pressed button when released.
         * @method _afterDocumentMouseup
         * @private
         */
        _afterDocumentMouseup: function () {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "_afterDocumentMouseup", 88);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 89);
this.get(BBX).removeClass(this._classNames.pressed);
        },

        /**
         * Adds the pressed class to bounding box
         * @method _afterBoundingBoxMousedown
         * @private
         */
        _afterBoundingBoxMousedown: function () {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "_afterBoundingBoxMousedown", 97);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 98);
if (!this.get(DISABLED)) {
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 99);
this.get(BBX).addClass(this._classNames.pressed);
            }
        },
        /**
         * Sets the title attribute to the bounding box
         * @method _uiSetTitle
         * @param title {String}
         * @private
         */
        _uiSetTitle: function (title) {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "_uiSetTitle", 108);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 109);
this.get(BBX).set(TITLE, title);
        },
        /**
         * Updates the default class on the bounding box
         * @method _uiSetDefault
         * @param state {boolean}
         * @private
         */
        _uiSetDefault: function (state) {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "_uiSetDefault", 117);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 118);
var bbx = this.get(BBX);
            _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 119);
if (state) {
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 120);
bbx.addClass(this._classNames[DEFAULT]);
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 121);
bbx.setAttribute(DEFAULT, DEFAULT);
            } else {
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 123);
bbx.removeClass(this._classNames[DEFAULT]);
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 124);
bbx.set(DEFAULT, '');
            }
        },
        /**
         * Sets the icon class for the bounding box
         *
         * @method _uiSetIcon
         * @param value {String} class suffix (always prefixed with <code>yui3-button-icon-</code>)
         * @private
         */
        _uiSetIcon: function (value) {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "_uiSetIcon", 134);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 135);
value = value || 'none';
            _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 136);
var newName = this._classNames[ICON] + '-' + value;
            _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 137);
this.get(BBX).replaceClass(
                this._prevIconClassName,
                newName
            );
            _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 141);
this._prevIconClassName = newName;
        },
        /**
         * Sets the position of the icon relative to the label.
         * Spans for icons are always set at either side,
         * this method changes a classname in the bounding box
         * so that one of them is hidden
         * @method _uiSetIconPosition
         * @param value {String} 'left' or 'right'
         * @private
         */

        _uiSetIconPosition: function (value) {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "_uiSetIconPosition", 153);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 154);
var cn = this._classNames;
            _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 155);
this.get(CBX).replaceClass(cn[ICON +(value===LEFT?RIGHT:LEFT)],cn[ICON + value]);
        },

        /**
         * Sets the icon class for the bounding box
         *
         * @method _uiSetLabel
         * @param value {String or null} label to be set or null for none
         * @private
         */
        _uiSetLabel: function (value) {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "_uiSetLabel", 165);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 166);
if (!value || value === '') {
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 167);
this.get(BBX).addClass(this._classNames.noLabel);
            } else {
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 169);
this.get(BBX).removeClass(this._classNames.noLabel);
            }
            _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 171);
this._labelNode.setContent(value || '');
        },
        /**
         * Sets the href attribute on the bounding box
         * @method _uiSetHref
         * @param value {String} url of link to be set.
         * @private
         */
        _uiSetHref: function (value) {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "_uiSetHref", 179);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 180);
this.get(BBX).set(HREF, value);
        },

        /**
         * Default click event handler
         * @method _afterBoundingBoxClick
         * @param ev {Event Facade}
         * @private
         */
        _afterBoundingBoxClick: function (ev) {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "_afterBoundingBoxClick", 189);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 190);
var href = this.get(HREF);

            _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 192);
if (this.get(DISABLED)) {
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 193);
ev.preventDefault();
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 194);
return;
            }

            _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 197);
if (!href || href === '#') {
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 198);
ev.preventDefault();
            }
            _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 200);
this.fire(EVENT_PRESS, {
                click: ev
            });
        },

        /**
         * Default press callback function
         * @method _defPressFn
         * @param ev {EventFacade}
         * @private
         */
        _defPressFn: function (ev) {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "_defPressFn", 211);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 212);
if (!this.get(DISABLED)) {
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 213);
var fn = this.get(CALLBACK) || this._callbackFromType();
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 214);
if (fn) {
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 215);
fn.apply(this, ev);
                }
            }
        },

        /**
         * Returns a function based on the type of button. Form buttons such
         *   as Submit and Reset are attached to their parent form if one is
         *   found.  Otherwise null is returned.
         *
         * @method _callbackFromType
         * @private
         * @return Function or null
         */
        _callbackFromType: function () {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "_callbackFromType", 229);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 230);
var bbx = this.get(BBX),
                frm = bbx.ancestor('form');

            _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 233);
if (frm) {
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 234);
switch (this.get(TYPE)) {
                case SUBMIT:
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 236);
return Y.bind(frm[SUBMIT], frm);
                case RESET:
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 238);
return Y.bind(frm[RESET], frm);
                }
            }
            _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 241);
return null;
        }


    },
    {
        /**
         * Constant for 'push' <a href="#config_type">type</a> button (the default)
         * @property Y.Button.PUSH
         * @type String
         * @default 'push'
         * @static
         */
        PUSH:PUSH,
        /**
         * Constant for 'submit' <a href="#config_type">type</a> button
         * @property Y.Button.SUBMIT
         * @type String
         * @default 'submit'
         * @static
         */
        SUBMIT:SUBMIT,
        /**
         * Constant for 'reset' <a href="#config_type">type</a> button (the default)
         * @property Y.Button.RESET
         * @type String
         * @default 'reset'
         * @static
         */
        RESET:RESET,
        /**
         * Constant to set the <a href="#config_iconPosition">iconPosition</a> to be to the left of the label
         * @property Y.Button.LEFT
         * @type String
         * @default 'left'
         * @static
         */
        LEFT: LEFT,
        /**
         * Constant to set the <a href="#config_iconPosition">iconPosition</a> to be to the right of the label
         * @property Y.Button.RIGHT
         * @type String
         * @default 'right'
         * @static
         */
        RIGHT: RIGHT,
        /**
         * Template to use by the MakeNode extension
         * @property _TEMPLATE
         * @type String
         * @static
         * @protected
         */
        _TEMPLATE: [
            '<span class="{c icon}"></span>',
            '<span class="{c label}">{@ label}</span>'
        ].join('\n'),

        /**
         * Class name suffixes for CSS classNames used in the widget
         * @property Y.Button._CLASS_NAMES
         * @type [Strings]
         * @static
         * @protected
         */
        _CLASS_NAMES: ['pressed', DEFAULT, 'no-label', LABEL, ICON, ICON + LEFT, ICON + RIGHT],
        /**
         * DOM events to be listened to, used by the MakeNode extension
         * @property Y.Button._EVENTS
         * @type Object
         * @static
         * @protected
         */
        _EVENTS: {
            boundingBox: ['click','mousedown'],
            document: 'mouseup'
        },
        _PUBLISH: {
            press: {
                defaultFn: "_defPressFn"
            }
        },
        ATTRS: {
            /**
             * Label to be shown on the button
             * @attribute label
             * @type string
             * @default ''
             */
            label: {
                value: '',
                validator: Lang.isString
            },
            /**
             * Function to be called on button click
             * @attribute callback
             * @type Function
             */
            callback: {
                validator: Lang.isFunction
            },
            /**
             * Button is to be the default button
             * @attribute default
             * @type Boolean
             * @default false
             */
            'default': {
                value: false,
                validator: Lang.isBoolean
            },
            /**
             * Suffix to be added to the <code>yui3-button-icon-</code> class to
             * set on the button
             * @attribute icon
             * @type string or null for none
             * @default null
             */
            icon: {
                value: null,
                validator: function(value) {
                    _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "validator", 361);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 362);
return Lang.isString(value) || Lang.isNull(value);
                }
            },
            /**
             * Whether the icon should go to the left or to the right of the label
             * @attribute iconPosition
             * @type String ('left' or 'right')
             * @default 'left'
             */
            iconPosition : {
                value : LEFT,
                validator: function (value) {
                    _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "validator", 373);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 374);
return value === LEFT || value === RIGHT;
                }
            },
            /**
             * href property to set on the button A element
             * @attribute href
             * @default null
             */
            href: {
                value: null
            },
            /**
             * Title (tooltip) to set on the button element
             * @attribute title
             * @type string
             */
            title: {
                value: '',
                validator: Lang.isString
            },
            /**
             * Defines the button type. One of push, submit or reset.  Any value but submit or reset will assume push.
             * @attribute type
             * @type string
             * @default push
             */
            type: {
                value: PUSH,
                validator: Lang.isString,
                lazyAdd: false
            }
        },
        _ATTRS_2_UI: {
            BIND: [LABEL, ICON, TITLE, HREF, DEFAULT, 'iconPosition'],
            SYNC: [LABEL, ICON, TITLE, HREF, DEFAULT, 'iconPosition']
        },
        /**
         * HTML Parser assumes srcNode is either a &lt;button&gt; or
         *   &lt;input type="submit|reset"&gt;
         */
        HTML_PARSER: {

            disabled: function (srcNode) {
                _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "disabled", 416);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 417);
return !!srcNode.get(DISABLED);
            },

            label: function (srcNode) {
                _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "label", 420);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 421);
if (srcNode.getAttribute(VALUE)) {
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 422);
return srcNode.getAttribute(VALUE);
                }
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 424);
if (srcNode.get(INNER_HTML)) {
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 425);
return srcNode.get(INNER_HTML);
                }

                // default form button labels based on type
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 429);
if (srcNode.get('tagName') === 'INPUT') {
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 430);
switch (srcNode.get(TYPE)) {
                    case RESET:
                        _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 432);
return RESET;
                    case SUBMIT:
                        _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 434);
return SUBMIT;
                    }
                }

                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 438);
return null;
            },

            href: function (srcNode) {
                _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "href", 441);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 442);
var href = srcNode.getAttribute(HREF);

                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 444);
if (href) {
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 445);
return href;
                }

                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 448);
return null;
            },

            type: function (srcNode) {
                _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "type", 451);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 452);
var type = srcNode.getAttribute(TYPE);

                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 454);
if (type) {
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 455);
return type.toLowerCase();
                }
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 457);
return null;
            },

            title: function (srcNode) {
                _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "title", 460);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 461);
if (srcNode.getAttribute(TITLE)) {
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 462);
return srcNode.getAttribute(TITLE);
                }
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 464);
if (srcNode.getAttribute(VALUE)) {
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 465);
return srcNode.getAttribute(VALUE);
                }
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 467);
if (srcNode.get(INNER_HTML)) {
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 468);
return srcNode.get(INNER_HTML);
                }
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 470);
return null;
            }

        }
    }
);

/**
 * The ButtonToggle class provides a two-state button
 * @class ButtonToggle
 * @extends Y.Button
 * @constructor
 * @param cfg {object} Configuration attributes
 */

_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 485);
Y.ButtonToggle = Y.Base.create(
    'buttonToggle',
    Y.Button,
    [],
    {
        /**
         * Overrides Button's <a href="Button.html#method__defPressFn">_defPressFn</a>
         * to produce the two-state effect
         * @method _defPressFn
         * @param ev {EventFacade}
         * @private
         */
        _defPressFn : function(ev) {
            _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "_defPressFn", 497);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 498);
if (!this.get(DISABLED)) {
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 499);
var newSelected = this.get(SELECTED)?0:1,
                    fn = this.get(newSelected?CALLBACK:DESELECTED_CALLBACK);
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 501);
if (fn) {
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 502);
fn.apply(this, ev);
                }
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 504);
this.set(SELECTED, newSelected);
                _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 505);
if (!this.ancestor) {
                    _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 506);
if (newSelected) {
                        _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 507);
this.get(BBX).addClass(this._classNames[SELECTED]);
                    } else {
                        _yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 509);
this.get(BBX).removeClass(this._classNames[SELECTED]);
                    }
                }
            }
        }
    },
    {
        /**
         * Class name suffixes for CSS classNames used in the widget.
         * Produces the yui3-button-toggle-selected className to be added
         * to the button if not within a ButtonGroup
         * @property Y.ButtonToggle._CLASS_NAMES
         * @type [Strings]
         * @static
         * @protected
         */
         _CLASS_NAMES:[SELECTED],
        ATTRS : {
            /**
             * Function to be called when the toggle is deselected
             * @attribute deselectedCallback
             * @type function or null
             * @default null
             */
            deselectedCallback : {
                value: null,
                validator : function (value) {
                    _yuitest_coverfunc("build/gallery-md-button/gallery-md-button.js", "validator", 535);
_yuitest_coverline("build/gallery-md-button/gallery-md-button.js", 536);
return Lang.isFunction(value) || Lang.isNull(value);
                }
            }
        }
    }
);



}, '@VERSION@', {"requires": ["base-build", "widget", "gallery-makenode"], "skinnable": true});
