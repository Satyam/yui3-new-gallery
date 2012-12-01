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
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].code=["YUI.add('gallery-button-plugin', function (Y, NAME) {","","/**","	Node plugin to handle toggle buttons and groups of mutually exclusive toggle buttons.","	Searches a given container for buttons marked with the `yui3-button-toggle` className","	and turns them into toggle buttons and also any HTML element with the `yui3-button-group-exclusive`","	className and makes the toggle buttons within it mutually exclussive.","	Adds the `selected` attribute, for toggle buttons it tells whether the button is in the pressed state,","	for groups of toggles points to the button currently presssed.","	Relies on the cssbutton module for styling.","	@module gallery-button-plugin","*/","/**","	@class ButtonPlugin","	@static","*/","","var C_BUTTON = 'yui3-button',","    SELECTED = 'selected',","    CLICK = 'click',","    DOT = '.',","    ARIA_PRESSED = 'aria-pressed',","    BUTTON_TOGGLE = 1,","    GROUP_TOGGLE = 2,","","    btn = {","        /**","            CSS className for selected buttons","            @property C_SELECTED","            @type String","            @default \"yui3-button-selected\"","            @static","         */","        C_SELECTED: C_BUTTON + '-selected',","","        /**","            CSS className for non-selected buttons","            @property C_NOT_SELECTED","            @type String","            @default \"\"","            @static","         */","        C_NOT_SELECTED: '',","","","        /**","            CSS className to identify toggle buttons","            @property C_TOGGLE","            @type String","            @default \"yui3-button-toggle\"","            @static","         */","        C_TOGGLE: C_BUTTON + '-toggle',","","        /**","            CSS className to identify elements containing mutually exclusive toggle buttons","            @property C_EXCLUSIVE","            @type String","            @default \"yui3-button-group-exclusive\"","            @static","         */","        C_EXCLUSIVE: C_BUTTON + '-group-exclusive',","","        /**","            Getter for the augmented `selected` Node attribute","            Returns the state of the toggle button or","            a Node reference to the toggle button selected within group.","            @method _selectedGetter","            @return Boolean for toggle buttons, Node reference for groups.","            @static","            @private","        */","        _selectedGetter: function () {","            console.log('_selectedSetter', this.get('id'));","            switch (this._toggleType) {","                case BUTTON_TOGGLE:","                    return this._toggleSelected;","                case GROUP_TOGGLE:","                    return this._selectedToggle;","                default:","                    return Y.Node.DEFAULT_GETTER.call(this, SELECTED);","            }","        },","","        /**","            Setter for the augmented `selected` Node attribute","            @method _selectedSetter","            @param value {Boolean|Node|String}  For toggle buttons: pressed state,","                   for groups of toggles, reference or css-selector of pressed button","            @static","            @private","        */","        _selectedSetter: function(value) {","            console.log('_selectedSetter', this.get('id'), value);","            var target = null,","                classes = this._cssClasses;","            switch (this._toggleType) {","","                case BUTTON_TOGGLE:","                    if (classes.C_SELECTED) {","                        this[value?'addClass':'removeClass'](classes.C_SELECTED);","                    }","                    if (classes.C_NOT_SELECTED) {","                        this[!value?'addClass':'removeClass'](classes.C_NOT_SELECTED);","                    }","                    this[value?'setAttribute':'removeAttribute'](ARIA_PRESSED, true);","                    this._toggleSelected = !!value;","                    break;","","                case GROUP_TOGGLE:","                    if (value) {","                        target = Y.one(value);","                        target.set(SELECTED, true);","                        this._selectedToggle = (target.get(SELECTED)?target:null);","                    } else {","                        this._selectedToggle = null;","                    }","                    this.all(DOT + classes.C_TOGGLE).each(function (node) {","                        if (node !== target) {","                            node.set(SELECTED, false);","                        }","                    });","                    break;","                default:","                    Y.Node.DEFAULT_SETTER.call(this,SELECTED, value);","                    break;","            }","            return value;","        },","","        /**","            Plugs into a toggle button","            @method _addToggleButton","            @param node {Node} Reference to the Node to be plugged into","            @private","            @static","        */","        _addToggleButton: function (node) {","            console.log('_addToggleButton', node.get('id'),this);","            node._toggleType = BUTTON_TOGGLE;","            node._cssClasses = this;","","            if (this.C_SELECTED) {","                node.set(SELECTED, node.hasClass(this.C_SELECTED));","            } else if (this.C_NOT_SELECTED) {","                node.set(SELECTED, !node.hasClass(this.C_NOT_SELECTED));","            }","            node.on(CLICK, function () {","                this.set(SELECTED, !this.get(SELECTED));","            });","","        },","        /**","            Plugs into a container of mutually exclusive toggle buttons","            @method _addButtonGroup","            @param node {Node} Reference to the container of the buttons","            @private","            @static","        */","        _addButtonGroup: function (node) {","            console.log('_addButtonGroup', node.get('id'), this);","            node._toggleType = GROUP_TOGGLE;","            node._cssClasses = this;","","            var cssSelected = this.C_SELECTED,","                cssSelToggle = DOT + this.C_TOGGLE;","","            if (cssSelected) {","                node.set(SELECTED, node.one(DOT + cssSelected));","            } else {","                node.set(SELECTED,  node.one(cssSelToggle + ':not(' + DOT + this.C_NOT_SELECTED + ')'));","            }","","            node.delegate(CLICK, function(ev) {","                ev.container.set(SELECTED, this.get(SELECTED)?this:null);","            }, cssSelToggle);","        },","        /**","            Searches within the given container or the body of the document for","            buttons marked with the className `yui3-button-toggle`","            and elements with the className `yui3-button-group-exclusive` and","            plugs them with this module","            @method addToggles","            @param [container] {Node|string} Node instance or css selector of the element","                containing the buttons or button groups to be plugged into.","                Assumes the document body if missing.","            @param [cssClasses] {Object} CSS classes to override","            @static","        */","","        addToggles: function (container, cssClasses) {","            console.log('addToggles', container, cssClasses);","            cssClasses = Y.merge({","                C_TOGGLE: btn.C_TOGGLE,","                C_SELECTED: btn.C_SELECTED,","                C_NOT_SELECTED: btn.C_NOT_SELECTED,","                C_EXCLUSIVE: btn.C_EXCLUSIVE","            }, cssClasses || {});","            container = Y.one(container || 'body');","            if (container.hasClass(cssClasses.C_TOGGLE)) {","                btn._addToggleButton.call(cssClasses,container);","            } else {","                container.all(DOT + cssClasses.C_TOGGLE).each(btn._addToggleButton, cssClasses);","            }","            if (container.hasClass(cssClasses.C_EXCLUSIVE)) {","                btn._addButtonGroup.call(cssClasses,container);","            } else {","                container.all(DOT + cssClasses.C_EXCLUSIVE).each(btn._addButtonGroup, cssClasses);","            }","        }","};","","","/**","    Augmented `selected` attribute.","","    - For toggle buttons a Boolean that indicates whether the button is pressed.","    - For groups of toggle buttons it can be:","","        * Node reference to the selected button (get or set).","        * null when none is selected or to deselect all (get or set).","        * A string representing a CSS selector (only on set).","    @for Node","    @attribute selected","*/","Y.Node.ATTRS[SELECTED] = {","    getter: btn._selectedGetter,","    setter: btn._selectedSetter","};","","/**","    Signals if it is a toggle button or a group of toggle buttons.","    1 for toggle buttons, 2 for groups of toggle buttons","    @property _toggleType","    @for Node","    @type integer","    @private"," */"," /**","    Holds a reference to the only pressed toggle button within a group","    @property _selectedToggle","    @for Node","    @type Y.Node","    @private"," */","","","Y.ButtonPlugin = btn;","","","","}, '@VERSION@', {\"requires\": [\"node\"], \"optional\": [\"cssbutton\"]});"];
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].lines = {"1":0,"18":0,"74":0,"75":0,"77":0,"79":0,"81":0,"94":0,"95":0,"97":0,"100":0,"101":0,"103":0,"104":0,"106":0,"107":0,"108":0,"111":0,"112":0,"113":0,"114":0,"116":0,"118":0,"119":0,"120":0,"123":0,"125":0,"126":0,"128":0,"139":0,"140":0,"141":0,"143":0,"144":0,"145":0,"146":0,"148":0,"149":0,"161":0,"162":0,"163":0,"165":0,"168":0,"169":0,"171":0,"174":0,"175":0,"192":0,"193":0,"199":0,"200":0,"201":0,"203":0,"205":0,"206":0,"208":0,"226":0,"248":0};
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].functions = {"_selectedGetter:73":0,"(anonymous 2):118":0,"_selectedSetter:93":0,"(anonymous 3):148":0,"_addToggleButton:138":0,"(anonymous 4):174":0,"_addButtonGroup:160":0,"addToggles:191":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-button-plugin/gallery-button-plugin.js"].coveredLines = 58;
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
console.log('_selectedSetter', this.get('id'));
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 75);
switch (this._toggleType) {
                case BUTTON_TOGGLE:
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 77);
return this._toggleSelected;
                case GROUP_TOGGLE:
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 79);
return this._selectedToggle;
                default:
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 81);
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
            _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "_selectedSetter", 93);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 94);
console.log('_selectedSetter', this.get('id'), value);
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 95);
var target = null,
                classes = this._cssClasses;
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 97);
switch (this._toggleType) {

                case BUTTON_TOGGLE:
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 100);
if (classes.C_SELECTED) {
                        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 101);
this[value?'addClass':'removeClass'](classes.C_SELECTED);
                    }
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 103);
if (classes.C_NOT_SELECTED) {
                        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 104);
this[!value?'addClass':'removeClass'](classes.C_NOT_SELECTED);
                    }
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 106);
this[value?'setAttribute':'removeAttribute'](ARIA_PRESSED, true);
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 107);
this._toggleSelected = !!value;
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 108);
break;

                case GROUP_TOGGLE:
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 111);
if (value) {
                        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 112);
target = Y.one(value);
                        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 113);
target.set(SELECTED, true);
                        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 114);
this._selectedToggle = (target.get(SELECTED)?target:null);
                    } else {
                        _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 116);
this._selectedToggle = null;
                    }
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 118);
this.all(DOT + classes.C_TOGGLE).each(function (node) {
                        _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "(anonymous 2)", 118);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 119);
if (node !== target) {
                            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 120);
node.set(SELECTED, false);
                        }
                    });
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 123);
break;
                default:
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 125);
Y.Node.DEFAULT_SETTER.call(this,SELECTED, value);
                    _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 126);
break;
            }
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 128);
return value;
        },

        /**
            Plugs into a toggle button
            @method _addToggleButton
            @param node {Node} Reference to the Node to be plugged into
            @private
            @static
        */
        _addToggleButton: function (node) {
            _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "_addToggleButton", 138);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 139);
console.log('_addToggleButton', node.get('id'),this);
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 140);
node._toggleType = BUTTON_TOGGLE;
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 141);
node._cssClasses = this;

            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 143);
if (this.C_SELECTED) {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 144);
node.set(SELECTED, node.hasClass(this.C_SELECTED));
            } else {_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 145);
if (this.C_NOT_SELECTED) {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 146);
node.set(SELECTED, !node.hasClass(this.C_NOT_SELECTED));
            }}
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 148);
node.on(CLICK, function () {
                _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "(anonymous 3)", 148);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 149);
this.set(SELECTED, !this.get(SELECTED));
            });

        },
        /**
            Plugs into a container of mutually exclusive toggle buttons
            @method _addButtonGroup
            @param node {Node} Reference to the container of the buttons
            @private
            @static
        */
        _addButtonGroup: function (node) {
            _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "_addButtonGroup", 160);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 161);
console.log('_addButtonGroup', node.get('id'), this);
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 162);
node._toggleType = GROUP_TOGGLE;
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 163);
node._cssClasses = this;

            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 165);
var cssSelected = this.C_SELECTED,
                cssSelToggle = DOT + this.C_TOGGLE;

            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 168);
if (cssSelected) {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 169);
node.set(SELECTED, node.one(DOT + cssSelected));
            } else {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 171);
node.set(SELECTED,  node.one(cssSelToggle + ':not(' + DOT + this.C_NOT_SELECTED + ')'));
            }

            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 174);
node.delegate(CLICK, function(ev) {
                _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "(anonymous 4)", 174);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 175);
ev.container.set(SELECTED, this.get(SELECTED)?this:null);
            }, cssSelToggle);
        },
        /**
            Searches within the given container or the body of the document for
            buttons marked with the className `yui3-button-toggle`
            and elements with the className `yui3-button-group-exclusive` and
            plugs them with this module
            @method addToggles
            @param [container] {Node|string} Node instance or css selector of the element
                containing the buttons or button groups to be plugged into.
                Assumes the document body if missing.
            @param [cssClasses] {Object} CSS classes to override
            @static
        */

        addToggles: function (container, cssClasses) {
            _yuitest_coverfunc("build/gallery-button-plugin/gallery-button-plugin.js", "addToggles", 191);
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 192);
console.log('addToggles', container, cssClasses);
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 193);
cssClasses = Y.merge({
                C_TOGGLE: btn.C_TOGGLE,
                C_SELECTED: btn.C_SELECTED,
                C_NOT_SELECTED: btn.C_NOT_SELECTED,
                C_EXCLUSIVE: btn.C_EXCLUSIVE
            }, cssClasses || {});
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 199);
container = Y.one(container || 'body');
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 200);
if (container.hasClass(cssClasses.C_TOGGLE)) {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 201);
btn._addToggleButton.call(cssClasses,container);
            } else {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 203);
container.all(DOT + cssClasses.C_TOGGLE).each(btn._addToggleButton, cssClasses);
            }
            _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 205);
if (container.hasClass(cssClasses.C_EXCLUSIVE)) {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 206);
btn._addButtonGroup.call(cssClasses,container);
            } else {
                _yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 208);
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
_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 226);
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


_yuitest_coverline("build/gallery-button-plugin/gallery-button-plugin.js", 248);
Y.ButtonPlugin = btn;



}, '@VERSION@', {"requires": ["node"], "optional": ["cssbutton"]});
