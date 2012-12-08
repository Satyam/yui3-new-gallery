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
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].code=["YUI.add('gallery-button-plugin', function (Y, NAME) {","","/**","	Node plugin to handle toggle buttons and groups of mutually exclusive toggle buttons.","	Searches a given container for buttons marked with the `yui3-button-toggle` className","	and turns them into toggle buttons and also any HTML element with the `yui3-button-group-exclusive`","	className and makes the toggle buttons within it mutually exclussive.","	Adds the `selected` attribute, for toggle buttons it tells whether the button is in the pressed state,","	for groups of toggles points to the button currently presssed.","	Relies on the cssbutton module for styling.","	@module gallery-button-plugin","*/","/**","	@class ButtonPlugin","	@static","*/","","var C_BUTTON = 'yui3-button',","    SELECTED = 'selected',","    CLICK = 'click',","    DOT = '.',","    ARIA_PRESSED = 'aria-pressed',","    BUTTON_TOGGLE = 1,","    GROUP_TOGGLE = 2,","","    btn = {","        /**","            CSS className for selected buttons","            @property C_SELECTED","            @type String","            @default \"yui3-button-selected\"","            @static","         */","        C_SELECTED: C_BUTTON + '-selected',","","        /**","            CSS className for non-selected buttons","            @property C_NOT_SELECTED","            @type String","            @default \"\"","            @static","         */","        C_NOT_SELECTED: '',","","","        /**","            CSS className to identify toggle buttons","            @property C_TOGGLE","            @type String","            @default \"yui3-button-toggle\"","            @static","         */","        C_TOGGLE: C_BUTTON + '-toggle',","","        /**","            CSS className to identify elements containing mutually exclusive toggle buttons","            @property C_EXCLUSIVE","            @type String","            @default \"yui3-button-group-exclusive\"","            @static","         */","        C_EXCLUSIVE: C_BUTTON + '-group-exclusive',","","        /**","            Getter for the augmented `selected` Node attribute","            Returns the state of the toggle button or","            a Node reference to the toggle button selected within group.","            @method _selectedGetter","            @return Boolean for toggle buttons, Node reference for groups.","            @static","            @private","        */","        _selectedGetter: function () {","            switch (this._toggleType) {","                case BUTTON_TOGGLE:","                    return this._toggleSelected;","                case GROUP_TOGGLE:","                    return this._selectedToggle;","                default:","                    return Y.Node.DEFAULT_GETTER.call(this, SELECTED);","            }","        },","","        /**","            Setter for the augmented `selected` Node attribute","            @method _selectedSetter","            @param value {Boolean|Node|String}  For toggle buttons: pressed state,","                   for groups of toggles, reference or css-selector of pressed button","            @static","            @private","        */","        _selectedSetter: function(value) {","            var target = null,","                classes = this._cssClasses;","            switch (this._toggleType) {","","                case BUTTON_TOGGLE:","                    if (classes.C_SELECTED) {","                        this[value?'addClass':'removeClass'](classes.C_SELECTED);","                    }","                    if (classes.C_NOT_SELECTED) {","                        this[!value?'addClass':'removeClass'](classes.C_NOT_SELECTED);","                    }","                    this[value?'setAttribute':'removeAttribute'](ARIA_PRESSED, true);","                    this._toggleSelected = !!value;","                    break;","","                case GROUP_TOGGLE:","                    if (value) {","                        target = Y.one(value);","                        target.set(SELECTED, true);","                        this._selectedToggle = target;","                    } else {","                        this._selectedToggle = null;","                    }","                    this.all(DOT + classes.C_TOGGLE).each(function (node) {","                        if (node !== target) {","                            node.set(SELECTED, false);","                        }","                    });","                    break;","                default:","                    Y.Node.DEFAULT_SETTER.call(this,SELECTED, value);","                    break;","            }","            return value;","        },","","        /**","            Plugs into a toggle button.","            @method _addToggleButton","            @param node {Node} Reference to the Node to be plugged into.","            @private","            @static","        */","        _addToggleButton: function (node) {","            node._toggleType = BUTTON_TOGGLE;","            node._cssClasses = this;","","            if (this.C_SELECTED) {","                node.set(SELECTED, node.hasClass(this.C_SELECTED));","            } else if (this.C_NOT_SELECTED) {","                node.set(SELECTED, !node.hasClass(this.C_NOT_SELECTED));","            }","            node.on(CLICK, function () {","                this.set(SELECTED, !this.get(SELECTED));","            });","","        },","","        /**","            Plugs into a container of mutually exclusive toggle buttons.","            @method _addButtonGroup","            @param node {Node} Reference to the container of the buttons.","            @private","            @static","        */","        _addButtonGroup: function (node) {","            node._toggleType = GROUP_TOGGLE;","            node._cssClasses = this;","","            var cssSelected = this.C_SELECTED,","                cssSelToggle = DOT + this.C_TOGGLE;","","            if (cssSelected) {","                node.set(SELECTED, node.one(DOT + cssSelected));","            } else {","                node.set(SELECTED,  node.one(cssSelToggle + ':not(' + DOT + this.C_NOT_SELECTED + ')'));","            }","","            node.delegate(CLICK, function(ev) {","                ev.container.set(SELECTED, this.get(SELECTED)?this:null);","            }, cssSelToggle);","        },","        /**","            Searches within the given container or the body of the document for","            buttons marked with the className `yui3-button-toggle`","            and elements with the className `yui3-button-group-exclusive` and","            plugs them with this module","            @method addToggles","            @param [container] {Node|string} Node instance or css selector of the","                button or button groups to be plugged into,","                or a container holding the buttons and groups.","                Assumes the document body if missing.","            @param [cssClasses] {Object} CSS classes to override","            @static","        */","","        addToggles: function (container, cssClasses) {","            cssClasses = Y.merge({","                C_TOGGLE: btn.C_TOGGLE,","                C_SELECTED: btn.C_SELECTED,","                C_NOT_SELECTED: btn.C_NOT_SELECTED,","                C_EXCLUSIVE: btn.C_EXCLUSIVE","            }, cssClasses || {});","            container = Y.one(container || 'body');","            if (container.hasClass(cssClasses.C_TOGGLE)) {","                btn._addToggleButton.call(cssClasses,container);","            } else {","                container.all(DOT + cssClasses.C_TOGGLE).each(btn._addToggleButton, cssClasses);","            }","            if (container.hasClass(cssClasses.C_EXCLUSIVE)) {","                btn._addButtonGroup.call(cssClasses,container);","            } else {","                container.all(DOT + cssClasses.C_EXCLUSIVE).each(btn._addButtonGroup, cssClasses);","            }","        }","};","","","/**","    Augmented `selected` attribute.","","    - For toggle buttons a Boolean that indicates whether the button is pressed.","    - For groups of toggle buttons it can be:","","        * Node reference to the selected button (get or set).","        * null when none is selected or to deselect all (get or set).","        * A string representing a CSS selector (only on set).","    @for Node","    @attribute selected","*/","Y.Node.ATTRS[SELECTED] = {","    getter: btn._selectedGetter,","    setter: btn._selectedSetter","};","","/**","    Signals if it is a toggle button or a group of toggle buttons.","    1 for toggle buttons, 2 for groups of toggle buttons","    @property _toggleType","    @for Node","    @type integer","    @private"," */"," /**","    Holds a reference to the only pressed toggle button within a group","    @property _selectedToggle","    @for Node","    @type Y.Node","    @private"," */"," /**","    Hash with the CSS classNames to use/apply to this Node","    @property _cssClasses","    @for Node","    @type Object","    @private","  */","","","Y.ButtonPlugin = btn;","","","","}, '@VERSION@', {\"requires\": [\"node\"], \"optional\": [\"cssbutton\"]});"];
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].lines = {"1":0,"18":0,"74":0,"76":0,"78":0,"80":0,"93":0,"95":0,"98":0,"99":0,"101":0,"102":0,"104":0,"105":0,"106":0,"109":0,"110":0,"111":0,"112":0,"114":0,"116":0,"117":0,"118":0,"121":0,"123":0,"124":0,"126":0,"137":0,"138":0,"140":0,"141":0,"142":0,"143":0,"145":0,"146":0,"159":0,"160":0,"162":0,"165":0,"166":0,"168":0,"171":0,"172":0,"190":0,"196":0,"197":0,"198":0,"200":0,"202":0,"203":0,"205":0,"223":0,"252":0};
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].functions = {"_selectedGetter:73":0,"(anonymous 2):116":0,"_selectedSetter:92":0,"(anonymous 3):145":0,"_addToggleButton:136":0,"(anonymous 4):171":0,"_addButtonGroup:158":0,"addToggles:189":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].coveredLines = 53;
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
*/
/**
	@class ButtonPlugin
	@static
*/

_yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 18);
var C_BUTTON = 'yui3-button',
    SELECTED = 'selected',
    CLICK = 'click',
    DOT = '.',
    ARIA_PRESSED = 'aria-pressed',
    BUTTON_TOGGLE = 1,
    GROUP_TOGGLE = 2,

    btn = {
        /**
            CSS className for selected buttons
            @property C_SELECTED
            @type String
            @default "yui3-button-selected"
            @static
         */
        C_SELECTED: C_BUTTON + '-selected',

        /**
            CSS className for non-selected buttons
            @property C_NOT_SELECTED
            @type String
            @default ""
            @static
         */
        C_NOT_SELECTED: '',


        /**
            CSS className to identify toggle buttons
            @property C_TOGGLE
            @type String
            @default "yui3-button-toggle"
            @static
         */
        C_TOGGLE: C_BUTTON + '-toggle',

        /**
            CSS className to identify elements containing mutually exclusive toggle buttons
            @property C_EXCLUSIVE
            @type String
            @default "yui3-button-group-exclusive"
            @static
         */
        C_EXCLUSIVE: C_BUTTON + '-group-exclusive',

        /**
            Getter for the augmented `selected` Node attribute
            Returns the state of the toggle button or
            a Node reference to the toggle button selected within group.
            @method _selectedGetter
            @return Boolean for toggle buttons, Node reference for groups.
            @static
            @private
        */
        _selectedGetter: function () {
            _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "_selectedGetter", 73);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 74);
switch (this._toggleType) {
                case BUTTON_TOGGLE:
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 76);
return this._toggleSelected;
                case GROUP_TOGGLE:
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 78);
return this._selectedToggle;
                default:
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 80);
return Y.Node.DEFAULT_GETTER.call(this, SELECTED);
            }
        },

        /**
            Setter for the augmented `selected` Node attribute
            @method _selectedSetter
            @param value {Boolean|Node|String}  For toggle buttons: pressed state,
                   for groups of toggles, reference or css-selector of pressed button
            @static
            @private
        */
        _selectedSetter: function(value) {
            _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "_selectedSetter", 92);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 93);
var target = null,
                classes = this._cssClasses;
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 95);
switch (this._toggleType) {

                case BUTTON_TOGGLE:
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 98);
if (classes.C_SELECTED) {
                        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 99);
this[value?'addClass':'removeClass'](classes.C_SELECTED);
                    }
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 101);
if (classes.C_NOT_SELECTED) {
                        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 102);
this[!value?'addClass':'removeClass'](classes.C_NOT_SELECTED);
                    }
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 104);
this[value?'setAttribute':'removeAttribute'](ARIA_PRESSED, true);
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 105);
this._toggleSelected = !!value;
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 106);
break;

                case GROUP_TOGGLE:
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 109);
if (value) {
                        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 110);
target = Y.one(value);
                        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 111);
target.set(SELECTED, true);
                        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 112);
this._selectedToggle = target;
                    } else {
                        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 114);
this._selectedToggle = null;
                    }
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 116);
this.all(DOT + classes.C_TOGGLE).each(function (node) {
                        _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "(anonymous 2)", 116);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 117);
if (node !== target) {
                            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 118);
node.set(SELECTED, false);
                        }
                    });
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 121);
break;
                default:
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 123);
Y.Node.DEFAULT_SETTER.call(this,SELECTED, value);
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 124);
break;
            }
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 126);
return value;
        },

        /**
            Plugs into a toggle button.
            @method _addToggleButton
            @param node {Node} Reference to the Node to be plugged into.
            @private
            @static
        */
        _addToggleButton: function (node) {
            _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "_addToggleButton", 136);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 137);
node._toggleType = BUTTON_TOGGLE;
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 138);
node._cssClasses = this;

            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 140);
if (this.C_SELECTED) {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 141);
node.set(SELECTED, node.hasClass(this.C_SELECTED));
            } else {_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 142);
if (this.C_NOT_SELECTED) {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 143);
node.set(SELECTED, !node.hasClass(this.C_NOT_SELECTED));
            }}
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 145);
node.on(CLICK, function () {
                _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "(anonymous 3)", 145);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 146);
this.set(SELECTED, !this.get(SELECTED));
            });

        },

        /**
            Plugs into a container of mutually exclusive toggle buttons.
            @method _addButtonGroup
            @param node {Node} Reference to the container of the buttons.
            @private
            @static
        */
        _addButtonGroup: function (node) {
            _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "_addButtonGroup", 158);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 159);
node._toggleType = GROUP_TOGGLE;
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 160);
node._cssClasses = this;

            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 162);
var cssSelected = this.C_SELECTED,
                cssSelToggle = DOT + this.C_TOGGLE;

            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 165);
if (cssSelected) {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 166);
node.set(SELECTED, node.one(DOT + cssSelected));
            } else {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 168);
node.set(SELECTED,  node.one(cssSelToggle + ':not(' + DOT + this.C_NOT_SELECTED + ')'));
            }

            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 171);
node.delegate(CLICK, function(ev) {
                _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "(anonymous 4)", 171);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 172);
ev.container.set(SELECTED, this.get(SELECTED)?this:null);
            }, cssSelToggle);
        },
        /**
            Searches within the given container or the body of the document for
            buttons marked with the className `yui3-button-toggle`
            and elements with the className `yui3-button-group-exclusive` and
            plugs them with this module
            @method addToggles
            @param [container] {Node|string} Node instance or css selector of the
                button or button groups to be plugged into,
                or a container holding the buttons and groups.
                Assumes the document body if missing.
            @param [cssClasses] {Object} CSS classes to override
            @static
        */

        addToggles: function (container, cssClasses) {
            _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "addToggles", 189);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 190);
cssClasses = Y.merge({
                C_TOGGLE: btn.C_TOGGLE,
                C_SELECTED: btn.C_SELECTED,
                C_NOT_SELECTED: btn.C_NOT_SELECTED,
                C_EXCLUSIVE: btn.C_EXCLUSIVE
            }, cssClasses || {});
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 196);
container = Y.one(container || 'body');
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 197);
if (container.hasClass(cssClasses.C_TOGGLE)) {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 198);
btn._addToggleButton.call(cssClasses,container);
            } else {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 200);
container.all(DOT + cssClasses.C_TOGGLE).each(btn._addToggleButton, cssClasses);
            }
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 202);
if (container.hasClass(cssClasses.C_EXCLUSIVE)) {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 203);
btn._addButtonGroup.call(cssClasses,container);
            } else {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 205);
container.all(DOT + cssClasses.C_EXCLUSIVE).each(btn._addButtonGroup, cssClasses);
            }
        }
};


/**
    Augmented `selected` attribute.

    - For toggle buttons a Boolean that indicates whether the button is pressed.
    - For groups of toggle buttons it can be:

        * Node reference to the selected button (get or set).
        * null when none is selected or to deselect all (get or set).
        * A string representing a CSS selector (only on set).
    @for Node
    @attribute selected
*/
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 223);
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
 /**
    Hash with the CSS classNames to use/apply to this Node
    @property _cssClasses
    @for Node
    @type Object
    @private
  */


_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 252);
Y.ButtonPlugin = btn;



}, '@VERSION@', {"requires": ["node"], "optional": ["cssbutton"]});
