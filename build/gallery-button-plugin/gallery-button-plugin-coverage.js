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
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-button-plugin/gallery-button-plugin.js",
    code: []
};
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].code=["YUI.add('gallery-button-plugin', function (Y, NAME) {","","/**","	Node plugin to handle toggle buttons and groups of mutually exclusive toggle buttons.","	Searches a given container for buttons marked with the `yui3-button-toggle` className","	and turns them into toggle buttons and also any HTML element with the `yui3-button-group-exclusive`","	className and makes the toggle buttons within it mutually exclussive.","	Adds the `selected` attribute, for toggle buttons it tells whether the button is in the pressed state,","	for groups of toggles points to the button currently presssed.","	Relies on the cssbutton module for styling.","	@module gallery-button-plugin","	@class ButtonPlugin","	@static","*/","","var btn = function() {},","","    C_BUTTON = 'yui3-button',","    C_TOGGLE = C_BUTTON + '-toggle',","    C_SELECTED = C_BUTTON + '-selected',","    C_EXCLUSIVE = C_BUTTON + '-group-exclusive',","    SELECTED = 'selected',","    CLICK = 'click',","    TOGGLE_BUTTON_SELECTOR = 'button.' + C_TOGGLE,","    SELECTED_BUTTON_SELECTOR = 'button.' + C_SELECTED,","    ARIA_PRESSED = 'aria-pressed',","    BUTTON_TOGGLE = 1,","    GROUP_TOGGLE = 2;","","/**","	Getter for the augmented `selected` Node attribute","	@method _selectedGetter","	@return Boolean for toggle buttons, Node reference for groups.","        State of the toggle button or Node of toggle button selected within group.","	@static","	@private","*/","btn._selectedGetter = function () {","    switch (this._toggleType) {","        case BUTTON_TOGGLE:","            return this._toggleSelected;","        case GROUP_TOGGLE:","            return this._selectedToggle;","        default:","            return Y.Node.DEFAULT_GETTER.call(this, SELECTED);","    }","};","","/**","    Setter for the augmented `selected` Node attribute","    @method _selectedSetter","    @param value {Boolean|Node|String}  For toggle buttons: pressed state,","           for groups of toggles, reference or css-selector of pressed button","    @static","    @private","*/","btn._selectedSetter = function(value) {","    var target = null;","    switch (this._toggleType) {","        case BUTTON_TOGGLE:","            this[value?'addClass':'removeClass'](C_SELECTED);","            this[value?'setAttribute':'removeAttribute'](ARIA_PRESSED, true);","            this._toggleSelected = !!value;","            break;","        case GROUP_TOGGLE:","            if (value) {","                target = Y.one(value);","                target.set(SELECTED, true);","                this._selectedToggle = (target.get(SELECTED)?target:null);","            } else {","                this._selectedToggle = null;","            }","            this.all(TOGGLE_BUTTON_SELECTOR).each(function (node) {","                if (node !== target) {","                    node.set(SELECTED, false);","                }","            });","            break;","        default:","            Y.Node.DEFAULT_SETTER.call(this,SELECTED, value);","            break;","    }","    return value;","};","","/**","    Plugs into a toggle button","    @method _addToggleButton","    @param node {Node} Reference to the Node to be plugged into","    @private","    @static","*/","btn._addToggleButton = function (node) {","    node._toggleType = BUTTON_TOGGLE;","    node.set(SELECTED, node.hasClass(C_SELECTED));","    node.on(CLICK, function () {","        this.set(SELECTED, !this.get(SELECTED));","    });","","};","/**","    Plugs into a container of mutually exclusive toggle buttons","    @method _addButtonGroup","    @param node {Node} Reference to the container of the buttons","    @private","    @static","*/","btn._addButtonGroup = function (node) {","    node._toggleType = GROUP_TOGGLE;","    node.set(SELECTED, Y.one(SELECTED_BUTTON_SELECTOR));","    node.delegate(CLICK, function(ev) {","        var target = ev.target;","        ev.container.set(SELECTED, target.get(SELECTED)?target:null);","    },TOGGLE_BUTTON_SELECTOR);","};","/**","    Searches within the given container or the body of the document for","    buttons marked with the className `yui3-button-toggle`","    and elements with the className `yui3-button-group-exclusive` and","    plugs them with this module","    @method addToggles","    @param [container] {Node|string} Node instance or css selector of the element","        containing the buttons or button groups to be plugged into.","        Assumes the document body if missing.","    @static","*/","","btn.addToggles = function (container) {","    container = Y.one(container || 'body');","    container.all(TOGGLE_BUTTON_SELECTOR).each(btn._addToggleButton);","    container.all('.' + C_EXCLUSIVE).each(btn._addButtonGroup);","};","","","/**","    Augmented `selected` attribute.","    For toggle buttons indicates whether the button is pressed.","    For groups of toggle buttons sets/return the reference to the button pressed","    @attribute selected","    @value Boolean for toggle buttons, Node reference or CSS selector for button groups","*/","Y.Node.ATTRS[SELECTED] = {","    getter: btn._selectedGetter,","    setter: btn._selectedSetter","};","","/**","    Signals if it is a toggle button or a group of toggle buttons.","    1 for toggle buttons, 2 for groups of toggle buttons","    @property _toggleType","    @for Node","    @type integer","    @private"," */"," /**","    Holds a reference to the only pressed toggle button within a group","    @property _selectedToggle","    @for Node","    @type Y.Node","    @private"," */","","","Y.ButtonPlugin = btn;","","","","}, '@VERSION@');"];
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].lines = {"1":0,"16":0,"38":0,"39":0,"41":0,"43":0,"45":0,"57":0,"58":0,"59":0,"61":0,"62":0,"63":0,"64":0,"66":0,"67":0,"68":0,"69":0,"71":0,"73":0,"74":0,"75":0,"78":0,"80":0,"81":0,"83":0,"93":0,"94":0,"95":0,"96":0,"97":0,"108":0,"109":0,"110":0,"111":0,"112":0,"113":0,"128":0,"129":0,"130":0,"131":0,"142":0,"164":0};
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].functions = {"_selectedGetter:38":0,"(anonymous 2):73":0,"_selectedSetter:57":0,"(anonymous 3):96":0,"_addToggleButton:93":0,"(anonymous 4):111":0,"_addButtonGroup:108":0,"addToggles:128":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].coveredLines = 43;
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].coveredFunctions = 9;
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 1);
YUI.add('gallery-button-plugin', function (Y, NAME) {

/**
	Node plugin to handle toggle buttons and groups of mutually exclusive toggle buttons.
	Searches a given container for buttons marked with the `yui3-button-toggle` className
	and turns them into toggle buttons and also any HTML element with the `yui3-button-group-exclusive`
	className and makes the toggle buttons within it mutually exclussive.
	Adds the `selected` attribute, for toggle buttons it tells whether the button is in the pressed state,
	for groups of toggles points to the button currently presssed.
	Relies on the cssbutton module for styling.
	@module gallery-button-plugin
	@class ButtonPlugin
	@static
*/

_yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 16);
var btn = function() {},

    C_BUTTON = 'yui3-button',
    C_TOGGLE = C_BUTTON + '-toggle',
    C_SELECTED = C_BUTTON + '-selected',
    C_EXCLUSIVE = C_BUTTON + '-group-exclusive',
    SELECTED = 'selected',
    CLICK = 'click',
    TOGGLE_BUTTON_SELECTOR = 'button.' + C_TOGGLE,
    SELECTED_BUTTON_SELECTOR = 'button.' + C_SELECTED,
    ARIA_PRESSED = 'aria-pressed',
    BUTTON_TOGGLE = 1,
    GROUP_TOGGLE = 2;

/**
	Getter for the augmented `selected` Node attribute
	@method _selectedGetter
	@return Boolean for toggle buttons, Node reference for groups.
        State of the toggle button or Node of toggle button selected within group.
	@static
	@private
*/
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 38);
btn._selectedGetter = function () {
    _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "_selectedGetter", 38);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 39);
switch (this._toggleType) {
        case BUTTON_TOGGLE:
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 41);
return this._toggleSelected;
        case GROUP_TOGGLE:
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 43);
return this._selectedToggle;
        default:
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 45);
return Y.Node.DEFAULT_GETTER.call(this, SELECTED);
    }
};

/**
    Setter for the augmented `selected` Node attribute
    @method _selectedSetter
    @param value {Boolean|Node|String}  For toggle buttons: pressed state,
           for groups of toggles, reference or css-selector of pressed button
    @static
    @private
*/
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 57);
btn._selectedSetter = function(value) {
    _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "_selectedSetter", 57);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 58);
var target = null;
    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 59);
switch (this._toggleType) {
        case BUTTON_TOGGLE:
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 61);
this[value?'addClass':'removeClass'](C_SELECTED);
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 62);
this[value?'setAttribute':'removeAttribute'](ARIA_PRESSED, true);
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 63);
this._toggleSelected = !!value;
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 64);
break;
        case GROUP_TOGGLE:
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 66);
if (value) {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 67);
target = Y.one(value);
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 68);
target.set(SELECTED, true);
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 69);
this._selectedToggle = (target.get(SELECTED)?target:null);
            } else {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 71);
this._selectedToggle = null;
            }
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 73);
this.all(TOGGLE_BUTTON_SELECTOR).each(function (node) {
                _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "(anonymous 2)", 73);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 74);
if (node !== target) {
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 75);
node.set(SELECTED, false);
                }
            });
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 78);
break;
        default:
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 80);
Y.Node.DEFAULT_SETTER.call(this,SELECTED, value);
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 81);
break;
    }
    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 83);
return value;
};

/**
    Plugs into a toggle button
    @method _addToggleButton
    @param node {Node} Reference to the Node to be plugged into
    @private
    @static
*/
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 93);
btn._addToggleButton = function (node) {
    _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "_addToggleButton", 93);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 94);
node._toggleType = BUTTON_TOGGLE;
    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 95);
node.set(SELECTED, node.hasClass(C_SELECTED));
    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 96);
node.on(CLICK, function () {
        _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "(anonymous 3)", 96);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 97);
this.set(SELECTED, !this.get(SELECTED));
    });

};
/**
    Plugs into a container of mutually exclusive toggle buttons
    @method _addButtonGroup
    @param node {Node} Reference to the container of the buttons
    @private
    @static
*/
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 108);
btn._addButtonGroup = function (node) {
    _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "_addButtonGroup", 108);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 109);
node._toggleType = GROUP_TOGGLE;
    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 110);
node.set(SELECTED, Y.one(SELECTED_BUTTON_SELECTOR));
    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 111);
node.delegate(CLICK, function(ev) {
        _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "(anonymous 4)", 111);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 112);
var target = ev.target;
        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 113);
ev.container.set(SELECTED, target.get(SELECTED)?target:null);
    },TOGGLE_BUTTON_SELECTOR);
};
/**
    Searches within the given container or the body of the document for
    buttons marked with the className `yui3-button-toggle`
    and elements with the className `yui3-button-group-exclusive` and
    plugs them with this module
    @method addToggles
    @param [container] {Node|string} Node instance or css selector of the element
        containing the buttons or button groups to be plugged into.
        Assumes the document body if missing.
    @static
*/

_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 128);
btn.addToggles = function (container) {
    _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "addToggles", 128);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 129);
container = Y.one(container || 'body');
    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 130);
container.all(TOGGLE_BUTTON_SELECTOR).each(btn._addToggleButton);
    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 131);
container.all('.' + C_EXCLUSIVE).each(btn._addButtonGroup);
};


/**
    Augmented `selected` attribute.
    For toggle buttons indicates whether the button is pressed.
    For groups of toggle buttons sets/return the reference to the button pressed
    @attribute selected
    @value Boolean for toggle buttons, Node reference or CSS selector for button groups
*/
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 142);
Y.Node.ATTRS[SELECTED] = {
    getter: btn._selectedGetter,
    setter: btn._selectedSetter
};

/**
    Signals if it is a toggle button or a group of toggle buttons.
    1 for toggle buttons, 2 for groups of toggle buttons
    @property _toggleType
    @for Node
    @type integer
    @private
 */
 /**
    Holds a reference to the only pressed toggle button within a group
    @property _selectedToggle
    @for Node
    @type Y.Node
    @private
 */


_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 164);
Y.ButtonPlugin = btn;



}, '@VERSION@');
