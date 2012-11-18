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
_yuitest_coverage["build/gallery-md-button-group/gallery-md-button-group.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-md-button-group/gallery-md-button-group.js",
    code: []
};
_yuitest_coverage["build/gallery-md-button-group/gallery-md-button-group.js"].code=["YUI.add('gallery-md-button-group', function (Y, NAME) {","","/**","* Provides a container to group buttons.","* It can hold instances of Y.Button, Y.ButtonToggle or Y.ButtonSeparator.","* @module gallery-md-button-group","*/","","\"use strict\";","","var Lang = Y.Lang,","	BBX = 'boundingBox',","	EVENT_PRESS = 'press',","	LABEL = 'label';","","/**"," * The ButtonSeparator class provides a passive divider to use in between groups of buttons"," * @class ButtonSeparator"," * @extends Y.Widget"," * @constructor"," */","Y.ButtonSeparator = Y.Base.create(","	'buttonSeparator',","	Y.Widget,","	[],","	{","		/**","		 * Overrides the standard bounding box template to produce a &lt;span&gt;","		 * @property BOUNDING_TEMPLATE","		 * @type String","		 */","		BOUNDING_TEMPLATE: '<span />'","	},","	{","	}",");","","/**"," * The ButtonGroup class provides a container for sets of Buttons."," * All buttons added will be extended with Y.WidgetChild."," * @class ButtonGroup"," * @extends Y.Widget"," * @uses Y.WidgetParent, Y.Makenode"," * @constructor"," * @param cfg {object} Configuration attributes"," */","","","Y.ButtonGroup = Y.Base.create(","	'buttonGroup',","	Y.Widget,","	[Y.WidgetParent,Y.MakeNode],","	{","		/**","		 * Overrides the standard bounding box template to produce a &lt;fieldset&gt;","		 * @property BOUNDING_TEMPLATE","		 * @type String","		 */","		BOUNDING_TEMPLATE: '<fieldset />',","		/**","		 * Sets the listener for the addChild event to extend children with Y.WidgetChild.","		 * Publishes the <code>press</code> event","		 */","		initializer: function () {","			this.on('addChild', function (ev) {","				var child = ev.child,","					WC = Y.WidgetChild;","				if (child) {","					if (child instanceof Y.Button || child instanceof Y.ButtonSeparator) {","						if (!child.ancestor) {","","							Y.augment(child, WC);","","							child.addAttrs(child._protectAttrs(WC.ATTRS));","","							WC.constructor.apply(child);","						}","					} else {","						ev.preventDefault();","					}","				}","			});","		},","","","		/**","		 * Sets listeners for the press event of child buttons, see <a href=\"#method__onButtonPress\">_onButtonPress</a>.","		 * @method bindUI","		 */","		bindUI : function() {","","			this.on(['button:press','buttonToggle:press'], this._onButtonPress ,this);","		},","		/**","		 * Processes the press event of child Buttons to enforce the <a href=\"#config__alwaysSelected\">_alwaysSelected</a> attribute,","		 * and to propagate the press event","		 * @method _onButtonPress","		 * @param ev {EventFacade}","		 * @private","		 */","		_onButtonPress: function(ev) {","			if(this.get('alwaysSelected')) {","				var selection = this.get('selection'),","					button = ev.target;","","				if(selection === button || // selection is the button OR","					(","						selection instanceof Y.ArrayList &&		// selection is an array AND","						selection.size() === 1 &&				// there is only one item AND","						selection.item(0) === button			// that one item is the button","					)","				) {","					ev.preventDefault();","					return;","				}","			}","			this.fire(EVENT_PRESS, {pressed: ev.target});","		},","		/**","		 * Sets the label of the container from the value of the <a href=\"#config_label\">label</a> configuration attribute.","		 * Creates the &lt;legend&gt; element to hold it if it does not exists.","		 * @method _uiSetLabel","		 * @param value {String} text to be shown","		 * @private","		 */","		_uiSetLabel: function (value) {","			if (!this._labelNode) {","				this.get(BBX).prepend(this._makeNode());","				this._locateNodes();","			}","			this._labelNode.setContent(value);","		}","","	}, {","		/**","		 * Template for the &lt;legend&gt; element to hold the label.  Used by MakeNode.","		 * @property Y.ButtonGroup._TEMPLATE","		 * @type String","		 * @static","		 * @protected","		 */","		_TEMPLATE: '<legend class=\"{c label}\">{@ label}</legend>',","		/**","		 * Creates the label className key to be used in the template","		 * @property Y.ButtonGroup._CLASS_NAMES","		 * @type [Strings]","		 * @static","		 * @protected","		 */","		_CLASS_NAMES: [LABEL],","		/**","		 * Hooks up <a href=\"method__uiSetLabel\">_uiSetLabel</a> to respond to changes in the <a href=\"#config_label\">label</a> attribute.","		 * @property Y.ButtonGroup._ATTRS_2_UI","		 * @type Object","		 * @static","		 * @protected","		 */","		_ATTRS_2_UI: {","			BIND: LABEL,","			SYNC: LABEL","		},","		_PUBLISH: {","			press:null","		},","		ATTRS : {","			/**","			 * Holds the label for this group of buttons","			 * @attribute label","			 * @type String","			 * @default \"\"","			 */","			label : {","				value:'',","				validator : Lang.isString","			},","","			/**","			 * Defines the default type of child to be contained in this group.","			 * Used by WidgetParent to create the default children","			 * @attribute defaultChildType","			 * @type object","			 * @default Y.Button","			 */","			defaultChildType : {","				value : Y.Button","			},","","			/**","			 * Forces this group to always have at least one toggle button selected","			 * @attribute alwaysSelected","			 * @type Boolean","			 * @default false","			 */","			alwaysSelected : {","				value : false,","				validator: Lang.isBoolean","			}","		}","	}",");","","","}, '@VERSION@');"];
_yuitest_coverage["build/gallery-md-button-group/gallery-md-button-group.js"].lines = {"1":0,"9":0,"11":0,"22":0,"49":0,"65":0,"66":0,"68":0,"69":0,"70":0,"72":0,"74":0,"76":0,"79":0,"92":0,"102":0,"103":0,"106":0,"113":0,"114":0,"117":0,"127":0,"128":0,"129":0,"131":0};
_yuitest_coverage["build/gallery-md-button-group/gallery-md-button-group.js"].functions = {"(anonymous 2):65":0,"initializer:64":0,"bindUI:90":0,"_onButtonPress:101":0,"_uiSetLabel:126":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-md-button-group/gallery-md-button-group.js"].coveredLines = 25;
_yuitest_coverage["build/gallery-md-button-group/gallery-md-button-group.js"].coveredFunctions = 6;
_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 1);
YUI.add('gallery-md-button-group', function (Y, NAME) {

/**
* Provides a container to group buttons.
* It can hold instances of Y.Button, Y.ButtonToggle or Y.ButtonSeparator.
* @module gallery-md-button-group
*/

_yuitest_coverfunc("build/gallery-md-button-group/gallery-md-button-group.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 9);
"use strict";

_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 11);
var Lang = Y.Lang,
	BBX = 'boundingBox',
	EVENT_PRESS = 'press',
	LABEL = 'label';

/**
 * The ButtonSeparator class provides a passive divider to use in between groups of buttons
 * @class ButtonSeparator
 * @extends Y.Widget
 * @constructor
 */
_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 22);
Y.ButtonSeparator = Y.Base.create(
	'buttonSeparator',
	Y.Widget,
	[],
	{
		/**
		 * Overrides the standard bounding box template to produce a &lt;span&gt;
		 * @property BOUNDING_TEMPLATE
		 * @type String
		 */
		BOUNDING_TEMPLATE: '<span />'
	},
	{
	}
);

/**
 * The ButtonGroup class provides a container for sets of Buttons.
 * All buttons added will be extended with Y.WidgetChild.
 * @class ButtonGroup
 * @extends Y.Widget
 * @uses Y.WidgetParent, Y.Makenode
 * @constructor
 * @param cfg {object} Configuration attributes
 */


_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 49);
Y.ButtonGroup = Y.Base.create(
	'buttonGroup',
	Y.Widget,
	[Y.WidgetParent,Y.MakeNode],
	{
		/**
		 * Overrides the standard bounding box template to produce a &lt;fieldset&gt;
		 * @property BOUNDING_TEMPLATE
		 * @type String
		 */
		BOUNDING_TEMPLATE: '<fieldset />',
		/**
		 * Sets the listener for the addChild event to extend children with Y.WidgetChild.
		 * Publishes the <code>press</code> event
		 */
		initializer: function () {
			_yuitest_coverfunc("build/gallery-md-button-group/gallery-md-button-group.js", "initializer", 64);
_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 65);
this.on('addChild', function (ev) {
				_yuitest_coverfunc("build/gallery-md-button-group/gallery-md-button-group.js", "(anonymous 2)", 65);
_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 66);
var child = ev.child,
					WC = Y.WidgetChild;
				_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 68);
if (child) {
					_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 69);
if (child instanceof Y.Button || child instanceof Y.ButtonSeparator) {
						_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 70);
if (!child.ancestor) {

							_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 72);
Y.augment(child, WC);

							_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 74);
child.addAttrs(child._protectAttrs(WC.ATTRS));

							_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 76);
WC.constructor.apply(child);
						}
					} else {
						_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 79);
ev.preventDefault();
					}
				}
			});
		},


		/**
		 * Sets listeners for the press event of child buttons, see <a href="#method__onButtonPress">_onButtonPress</a>.
		 * @method bindUI
		 */
		bindUI : function() {

			_yuitest_coverfunc("build/gallery-md-button-group/gallery-md-button-group.js", "bindUI", 90);
_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 92);
this.on(['button:press','buttonToggle:press'], this._onButtonPress ,this);
		},
		/**
		 * Processes the press event of child Buttons to enforce the <a href="#config__alwaysSelected">_alwaysSelected</a> attribute,
		 * and to propagate the press event
		 * @method _onButtonPress
		 * @param ev {EventFacade}
		 * @private
		 */
		_onButtonPress: function(ev) {
			_yuitest_coverfunc("build/gallery-md-button-group/gallery-md-button-group.js", "_onButtonPress", 101);
_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 102);
if(this.get('alwaysSelected')) {
				_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 103);
var selection = this.get('selection'),
					button = ev.target;

				_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 106);
if(selection === button || // selection is the button OR
					(
						selection instanceof Y.ArrayList &&		// selection is an array AND
						selection.size() === 1 &&				// there is only one item AND
						selection.item(0) === button			// that one item is the button
					)
				) {
					_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 113);
ev.preventDefault();
					_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 114);
return;
				}
			}
			_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 117);
this.fire(EVENT_PRESS, {pressed: ev.target});
		},
		/**
		 * Sets the label of the container from the value of the <a href="#config_label">label</a> configuration attribute.
		 * Creates the &lt;legend&gt; element to hold it if it does not exists.
		 * @method _uiSetLabel
		 * @param value {String} text to be shown
		 * @private
		 */
		_uiSetLabel: function (value) {
			_yuitest_coverfunc("build/gallery-md-button-group/gallery-md-button-group.js", "_uiSetLabel", 126);
_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 127);
if (!this._labelNode) {
				_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 128);
this.get(BBX).prepend(this._makeNode());
				_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 129);
this._locateNodes();
			}
			_yuitest_coverline("build/gallery-md-button-group/gallery-md-button-group.js", 131);
this._labelNode.setContent(value);
		}

	}, {
		/**
		 * Template for the &lt;legend&gt; element to hold the label.  Used by MakeNode.
		 * @property Y.ButtonGroup._TEMPLATE
		 * @type String
		 * @static
		 * @protected
		 */
		_TEMPLATE: '<legend class="{c label}">{@ label}</legend>',
		/**
		 * Creates the label className key to be used in the template
		 * @property Y.ButtonGroup._CLASS_NAMES
		 * @type [Strings]
		 * @static
		 * @protected
		 */
		_CLASS_NAMES: [LABEL],
		/**
		 * Hooks up <a href="method__uiSetLabel">_uiSetLabel</a> to respond to changes in the <a href="#config_label">label</a> attribute.
		 * @property Y.ButtonGroup._ATTRS_2_UI
		 * @type Object
		 * @static
		 * @protected
		 */
		_ATTRS_2_UI: {
			BIND: LABEL,
			SYNC: LABEL
		},
		_PUBLISH: {
			press:null
		},
		ATTRS : {
			/**
			 * Holds the label for this group of buttons
			 * @attribute label
			 * @type String
			 * @default ""
			 */
			label : {
				value:'',
				validator : Lang.isString
			},

			/**
			 * Defines the default type of child to be contained in this group.
			 * Used by WidgetParent to create the default children
			 * @attribute defaultChildType
			 * @type object
			 * @default Y.Button
			 */
			defaultChildType : {
				value : Y.Button
			},

			/**
			 * Forces this group to always have at least one toggle button selected
			 * @attribute alwaysSelected
			 * @type Boolean
			 * @default false
			 */
			alwaysSelected : {
				value : false,
				validator: Lang.isBoolean
			}
		}
	}
);


}, '@VERSION@');
