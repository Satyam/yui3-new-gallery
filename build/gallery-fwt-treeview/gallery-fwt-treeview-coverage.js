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
_yuitest_coverage["build/gallery-fwt-treeview/gallery-fwt-treeview.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-fwt-treeview/gallery-fwt-treeview.js",
    code: []
};
_yuitest_coverage["build/gallery-fwt-treeview/gallery-fwt-treeview.js"].code=["YUI.add('gallery-fwt-treeview', function (Y, NAME) {","","'use strict';","/*jslint white: true */","var Lang = Y.Lang,","	YArray = Y.Array,","    FWTV,","	getCName = Y.ClassNameManager.getClassName,","	cName = function (name) {","		return getCName('fw-treeview', name);","	},","	CNAMES = {","		cname_toggle: cName('toggle'),","		cname_icon: cName('icon'),","		cname_selection: cName('selection'),","		// cname_content: cName('content'),","		cname_sel_prefix: cName('selected-state'),","        cname_label: cName('label')","	},","	CBX = 'contentBox',","    EXPANDED = 'expanded',","    SELECTED = 'selected',","    CHANGE = 'Change',","	NOT_SELECTED = 0,","	PARTIALLY_SELECTED = 1,","	FULLY_SELECTED = 2;","/** Creates a Treeview using the FlyweightTreeManager Widget to handle its nodes."," * It creates the tree based on an object passed as the `tree` attribute in the constructor."," * @example"," *","	var tv = new Y.FWTreeView({tree: [","		{","			label:'label 0',","			children: [","				{","					label: 'label 0-0',","					children: [","						{label: 'label 0-0-0'},","						{label: 'label 0-0-1'}","					]","				},","				{label: 'label 0-1'}","			]","		},","		{label: 'label 1'}","","	]});","	tv.render('#container');",""," * @module gallery-fwt-treeview"," */","/**"," * @class FWTreeView"," * @extends FlyweightTreeManager"," * @constructor"," * @param config {Object} Configuration attributes, amongst them:"," * @param config.tree {Array} Array of objects defining the first level of nodes."," * @param config.tree.label {String} Text of HTML markup to be shown in the node"," * @param [config.tree.expanded=true] {Boolean} Whether the children of this node should be visible."," * @param [config.tree.children] {Array} Further definitions for the children of this node"," * @param [config.tree.type=FWTreeNode] {FWTreeNode | String} Class used to create instances for this node."," * It can be a reference to an object or a name that can be resolved as `Y[name]`."," * @param [config.tree.id=Y.guid()] {String} Identifier to assign to the DOM element containing this node."," * @param [config.tree.template] {String} Template for this particular node."," */","FWTV = Y.Base.create(","	NAME,","	Y.FlyweightTreeManager,","	[],","	{","        /**","         * Array of iNodes containing a flat list of all nodes visible regardless","         * of their depth in the tree.","         * Used to handle keyboard navigation.","         * @property _visibleSequence","         * @type Array or null","         * @default null","         * @private","         */","        _visibleSequence: null,","        /**","         * Index, within {{#crossLink \"_visibleSequence\"}}{{/crossLink}}, of the iNode having the focus.","         * Used for keyboard navigation.","         * @property _visibleIndex","         * @type Integer","         * @default null","         * @private","         */","        _visibleIndex: null,","		/**","		 * Widget lifecycle method","		 * @method initializer","		 * @param config {object} configuration object of which","		 * `tree` contains the tree configuration.","		 */","		initializer: function (config) {","			this._domEvents = ['click'];","			this._loadConfig(config.tree);","		},","		/**","		 * Widget lifecyle method.","         * Adds the `tree` role to the content box.","		 * @method renderUI","		 * @protected","		 */","		renderUI: function () {","            FWTV.superclass.renderUI.apply(this, arguments);","            this.get(CBX).set('role','tree');","		},","		/**","		 * Widget lifecyle method.","         * Sets the keydown listener to handle keyboard navigation.","		 * @method bindUI","		 * @protected","		 */","        bindUI: function () {","            FWTV.superclass.bindUI.apply(this, arguments);","            this._eventHandles.push(this.get(CBX).on('keydown', this._onKeyDown, this));","        },","        /**","         * Listener for keyboard events to handle keyboard navigation","         * @method _onKeyDown","         * @param ev {EventFacade} Standard YUI key facade","         * @private","         */","        _onKeyDown: function (ev) {","            var ch = ev.charCode,","                iNode = this._focusedINode,","                seq = this._visibleSequence,","                index = this._visibleIndex,","                fwNode;","","            switch (ch) {","                case 38: // up","                    if (!seq) {","                        seq = this._rebuildSequence();","                        index = seq.indexOf(iNode);","                    }","                    index -=1;","                    if (index >= 0) {","                        iNode = seq[index];","                        this._visibleIndex = index;","                    } else {","                        iNode = null;","                    }","                    break;","                case 39: // right","                    if (iNode.expanded) {","                        if (iNode.children && iNode.children.length) {","                            iNode = iNode.children[0];","                        } else {","                            iNode = null;","                        }","                    } else {","                        this._poolReturn(this._poolFetch(iNode).set(EXPANDED, true));","                        iNode = null;","                    }","","                    break;","                case 40: // down","                    if (!seq) {","                        seq = this._rebuildSequence();","                        index = seq.indexOf(iNode);","                    }","                    index +=1;","                    if (index < seq.length) {","                        iNode = seq[index];","                        this._visibleIndex = index;","                    } else {","                        iNode = null;","                    }","                    break;","                case 37: // left","                    if (iNode.expanded && iNode.children) {","                        this._poolReturn(this._poolFetch(iNode).set(EXPANDED, false));","                        iNode = null;","                    } else {","                        iNode = iNode._parent;","                        if (iNode === this._tree) {","                            iNode = null;","                        }","                    }","","                    break;","                case 36: // home","                    iNode = this._tree.children && this._tree.children[0];","                    break;","                case 35: // end","                    index = this._tree.children && this._tree.children.length;","                    if (index) {","                        iNode = this._tree.children[index -1];","                    } else {","                        iNode = null;","                    }","                    break;","                case 13: // enter","                    fwNode = this._poolFetch(iNode);","                    this.fire('enterkey', {","                        domEvent:ev,","                        node: fwNode","                    });","                    fwNode.fire('enterkey', {","                        domEvent:ev,","                        node: fwNode","                    });","                    this._poolReturn(fwNode);","                    iNode = null;","                    break;","                case 32: // spacebar","                    fwNode = this._poolFetch(iNode);","                    this.fire('spacebar', {","                        domEvent:ev,","                        node: fwNode","                    });","                    fwNode.fire('spacebar', {","                        domEvent:ev,","                        node: fwNode","                    });","                    this._poolReturn(fwNode);","                    iNode = null;","                    break;","                case 106: // asterisk on the numeric keypad","                    this.expandAll();","                    break;","                default: // initial","                    iNode = null;","                    break;","            }","            if (iNode) {","                this._focusOnINode(iNode);","                ev.halt();","                return false;","            }","            return true;","        },","        /**","         * Listener for the focus event.","         * Updates the node receiving the focus when the widget gets the focus.","         * @method _aferFocus","         * @param ev {EventFacade} Standard event facade","         * @private","         */","        _afterFocus: function (ev) {","            var iNode = this._findINodeByElement(ev.domEvent.target);","            this._focusOnINode(iNode);","            if (this._visibleSequence) {","                this._visibleIndex = this._visibleSequence.indexOf(iNode);","            }","        },","        /**","         * Rebuilds the array of {{#crossLink \"_visibleSequence\"}}{{/crossLink}} that can be traversed with the up/down arrow keys","         * @method _rebuildSequence","         * @private","         */","        _rebuildSequence: function () {","            var seq = [],","                loop = function(iNode) {","                    YArray.each(iNode.children || [], function(childINode) {","                        seq.push(childINode);","                        if (childINode.expanded) {","                            loop(childINode);","                        }","                    });","                };","            loop(this._tree);","            return (this._visibleSequence = seq);","","        },","		/**","		 * Overrides the default CONTENT_TEMPLATE to make it an unordered list instead of a div","		 * @property CONTENT_TEMPLATE","		 * @type String","		 */","		CONTENT_TEMPLATE: '<ul></ul>'","","	},","	{","		ATTRS: {","			/**","			 * Override for the `defaultType` value of FlyweightTreeManager","			 * so it creates FWTreeNode instances instead of the default.","			 * @attribute defaultType","			 * @type String","			 * @default 'FWTreeNode'","			 */","			defaultType: {","				value: 'FWTreeNode'","			},","			/**","			 * Enables toggling by clicking on the label item instead of just the toggle icon.","			 * @attribute toggleOnLabelClick","			 * @type Boolean","			 * @value false","			 */","			toggleOnLabelClick: {","				value:false,","				validator:Lang.isBoolean","			}","","","		}","","	}",");","","/**"," * TreeView provides all the events that Widget relays from the DOM."," * It adds an additional property to the EventFacade called `node`"," * that points to the TreeNode instance that received the event."," *"," * This instance is pooled and will be discarded upon return from the listener."," * If you need to hold on to this instance,"," * use the {{#crossLink \"TreeNode/hold\"}}{{/crossLink}} method to preserve it."," * @event -any-"," * @param type {String} The full name of the event fired"," * @param ev {EventFacade} Standard YUI event facade for DOM events plus:"," * @param ev.node {TreeNode} TreeNode instance that received the event"," */","/**"," * Fires when the space bar is pressed."," * Used internally to toggle node selection."," * @event spacebar"," * @param ev {EventFacade} YUI event facade for keyboard events, including:"," * @param ev.domEvent {Object} The original event produced by the DOM"," * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed"," */","/**"," * Fires when the enter key is pressed."," * @event enterkey"," * @param ev {EventFacade} YUI event facade for keyboard events, including:"," * @param ev.domEvent {Object} The original event produced by the DOM"," * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed"," */","Y.FWTreeView = FWTV;/** This class must not be generated directly."," *  Instances of it will be provided by FWTreeView as required."," *"," *  Subclasses might be defined based on it."," *  Usually, they will add further attributes and redefine the TEMPLATE to"," *  show those extra attributes."," *"," *  @module gallery-fwt-treeview"," */","/**"," *"," *  @class FWTreeNode"," *  @extends FlyweightTreeNode"," *  @constructor"," */"," Y.FWTreeNode = Y.Base.create(","	'fw-treenode',","	Y.FlyweightTreeNode,","	[],","	{","		initializer: function() {","			this._root._eventHandles.push(","                this.after('click', this._afterClick),","                this.after(SELECTED + CHANGE, this._afterSelectedChange),","                this.after('spacebar', this.toggleSelection),","                this.after(EXPANDED + CHANGE, this._afterExpandedChanged)","            );","		},","        /**","         * Listens to changes in the expanded attribute to invalidate and force","         * a rebuild of the list of visible nodes","         * the user can navigate through via the keyboard.","         * @method _afterExpandedChanged","         * @protected","         */","        _afterExpandedChanged: function () {","            this._root._visibleSequence = null;","        },","		/**","		 * Responds to the click event by toggling the node","		 * @method _afterClick","		 * @param ev {EventFacade}","		 * @private","		 */","		_afterClick: function (ev) {","			var target = ev.domEvent.target;","			if (target.hasClass(CNAMES.cname_toggle)) {","				this.toggle();","			} else if (target.hasClass(CNAMES.cname_selection)) {","				this.toggleSelection();","			} else if (target.hasClass(CNAMES.cname_content) || target.hasClass(CNAMES.cname_icon)) {","				if (this.get('root').get('toggleOnLabelClick')) {","					this.toggle();","				}","			}","		},","		/**","		 * Sugar method to toggle the selected state of a node.","         * See {{#crossLink \"selected:attribute\"}}{{/crossLink}}.","		 * @method toggleSelection","		 */","		toggleSelection: function() {","			this.set(SELECTED, (this.get(SELECTED)?NOT_SELECTED:FULLY_SELECTED));","		},","		/**","		 * Changes the UI to reflect the selected state and propagates the selection up and/or down.","		 * @method _afterSelectedChange","		 * @param ev {EventFacade} out of which","		 * @param ev.src {String} if not undefined it can be `'propagateUp'` or `'propagateDown'`","         * so that propagation goes in just one direction and doesn't bounce back.","		 * @private","		 */","		_afterSelectedChange: function (ev) {","			var selected = ev.newVal,","                prefix = CNAMES.cname_sel_prefix + '-',","                el;","","			if (!this.isRoot()) {","				el = Y.one('#' + this.get('id'));","                el.replaceClass(prefix + ev.prevVal, prefix + selected);","                el.set('aria-checked', this._ariaCheckedGetter());","				if (this.get('propagateUp') && ev.src !== 'propagatingDown') {","					this.getParent()._childSelectedChange().release();","				}","			}","			if (this.get('propagateDown') && ev.src !== 'propagatingUp') {","				this.forSomeChildren(function(node) {","					node.set(SELECTED , selected, 'propagatingDown');","				});","			}","		},","        /**","         * Getter for the {{#crossLink \"_aria_checked:attribute\"}}{{/crossLink}}.","         * Translate the internal {{#crossLink \"selected:attribute\"}}{{/crossLink}}","         * to the strings the `aria_checked` attribute expects","         * @method _ariaCheckedGetter","         * @return {String} One of 'false', 'true' or 'mixed'","         * @private","         */","        _ariaCheckedGetter: function () {","            return ['false','mixed','true'][this.get(SELECTED)];","        },","		/**","		 * Overrides the original in FlyweightTreeNode so as to propagate the selected state","		 * on dynamically loaded nodes.","		 * @method _dynamicLoadReturn","		 * @private","		 */","		_dynamicLoadReturn: function () {","            Y.FWTreeNode.superclass._dynamicLoadReturn.apply(this, arguments);","			if (this.get('propagateDown')) {","				var selected = this.get(SELECTED);","				this.forSomeChildren(function(node) {","					node.set(SELECTED , selected, 'propagatingDown');","				});","			}","            this._root._visibleSequence = null;","","		},","		/**","		 * When propagating selection up, it is called by a child when changing its selected state","		 * so that the parent adjusts its own state accordingly.","		 * @method _childSelectedChange","		 * @private","		 */","		_childSelectedChange: function () {","			var count = 0, selCount = 0;","			this.forSomeChildren(function (node) {","				count +=2;","				selCount += node.get(SELECTED);","			});","			this.set(SELECTED, (selCount === 0?NOT_SELECTED:(selCount === count?FULLY_SELECTED:PARTIALLY_SELECTED)), {src:'propagatingUp'});","			return this;","		}","","	},","	{","		/**","		 * Template to produce the markup for a node in the tree.","		 * @property TEMPLATE","		 * @type String","		 * @static","		 */","		TEMPLATE: Lang.sub(","            '<li id=\"{id}\" class=\"{cname_node} {cname_sel_prefix}-{selected}\" ' +","                'role=\"treeitem\" aria-expanded=\"{expanded}\" aria-checked=\"{_aria_checked}\">' +","            '<div tabIndex=\"{tabIndex}\" class=\"{cname_content}\"><div class=\"{cname_toggle}\"></div>' +","            '<div class=\"{cname_icon}\"></div><div class=\"{cname_selection}\"></div><div class=\"{cname_label}\">{label}</div></div>' +","            '<ul class=\"{cname_children}\" role=\"group\">{children}</ul></li>', CNAMES),","		/**","		 * Constant to use with the `selected` attribute to indicate the node is not selected.","		 * @property NOT_SELECTED","		 * @type integer","		 * @value 0","		 * @static","		 * @final","		 */","		NOT_SELECTED:NOT_SELECTED,","		/**","		 * Constant to use with the `selected` attribute to indicate some","		 * but not all of the children of this node are selected.","		 * This state should only be acquired by upward propagation from descendants.","		 * @property PARTIALLY_SELECTED","		 * @type integer","		 * @value 1","		 * @static","		 * @final","		 */","		PARTIALLY_SELECTED:PARTIALLY_SELECTED,","		/**","		 * Constant to use with the `selected` attribute to indicate the node is selected.","		 * @property FULLY_SELECTED","		 * @type integer","		 * @value 2","		 * @static","		 * @final","		 */","		FULLY_SELECTED:FULLY_SELECTED,","		ATTRS: {","			/**","			 * Selected/highlighted state of the node.","             *","             * The node selection mechanism is always enabled though it might not be visible.","             * It only sets a suitable className on the tree node.","             * The module is provided with a default CSS style that makes node selection visible.","             * To enable it, add the `yui3-fw-treeview-checkbox` className to the container of the tree.","             *","			 * `selected` can be","			 *","			 * - Y.FWTreeNode.NOT_SELECTED (0) not selected","			 * - Y.FWTreeNode.PARTIALLY_SELECTED (1) partially selected: some children are selected, some not or partially selected.","			 * - Y.FWTreeNode.FULLY_SELECTED (2) fully selected.","			 *","			 * The partially selected state can only be the result of selection propagating up from a child node.","			 * The attribute might return PARTIALLY_SELECTED but the developer should never set that value.","			 * @attribute selected","			 * @type Integer","			 * @value NOT_SELECTED","			 */","			selected: {","				value:NOT_SELECTED,","				validator:function (value) {","					return value === NOT_SELECTED || value === FULLY_SELECTED || value === PARTIALLY_SELECTED;","				}","			},","            /**","             * String value equivalent to the {{#crossLink \"selected:attribute\"}}{{/crossLink}}","             * for use in template expansion.","             * @attribute _aria_checked","             * @type String","             * @default false","             * @readonly","             * @protected","             */","            _aria_checked: {","                readOnly: true,","                getter: '_ariaCheckedGetter'","            },","			/**","			 * Whether selection of one node should propagate to its parent.","             * See {{#crossLink \"selected:attribute\"}}{{/crossLink}}.","			 * @attribute propagateUp","			 * @type Boolean","			 * @value true","			 */","			propagateUp: {","				value: true,","				validator: Lang.isBoolean","			},","			/**","			 * Whether selection of one node should propagate to its children.","             * See {{#crossLink \"selected:attribute\"}}{{/crossLink}}.","             * @attribute propagateDown","			 * @type Boolean","			 * @value true","			 */","			propagateDown: {","				value: true,","				validator: Lang.isBoolean","			}","		}","	}",");","","/**"," * Fires when the space bar is pressed."," * Used internally to toggle node selection."," * @event spacebar"," * @param ev {EventFacade} YUI event facade for keyboard events, including:"," * @param ev.domEvent {Object} The original event produced by the DOM"," * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed"," */","/**"," * Fires when the enter key is pressed."," * @event enterkey"," * @param ev {EventFacade} YUI event facade for keyboard events, including:"," * @param ev.domEvent {Object} The original event produced by the DOM"," * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed"," */","/**"," * Fires when this node is clicked."," * Used internally to toggle expansion or selection when clicked"," * on the corresponding icons."," *"," * It cannot be prevented.  This is a helper event, the actual event"," * happens on the TreeView instance and it is relayed here for convenience."," * @event click"," * @param ev {EventFacade} Standard YUI event facade for mouse events."," */","","}, '@VERSION@', {\"requires\": [\"gallery-flyweight-tree\", \"widget\", \"base-build\"], \"skinnable\": true});"];
_yuitest_coverage["build/gallery-fwt-treeview/gallery-fwt-treeview.js"].lines = {"1":0,"3":0,"5":0,"10":0,"66":0,"97":0,"98":0,"107":0,"108":0,"117":0,"118":0,"127":0,"133":0,"135":0,"136":0,"137":0,"139":0,"140":0,"141":0,"142":0,"144":0,"146":0,"148":0,"149":0,"150":0,"152":0,"155":0,"156":0,"159":0,"161":0,"162":0,"163":0,"165":0,"166":0,"167":0,"168":0,"170":0,"172":0,"174":0,"175":0,"176":0,"178":0,"179":0,"180":0,"184":0,"186":0,"187":0,"189":0,"190":0,"191":0,"193":0,"195":0,"197":0,"198":0,"202":0,"206":0,"207":0,"208":0,"210":0,"211":0,"215":0,"219":0,"220":0,"221":0,"223":0,"224":0,"226":0,"227":0,"229":0,"230":0,"231":0,"232":0,"234":0,"244":0,"245":0,"246":0,"247":0,"256":0,"258":0,"259":0,"260":0,"261":0,"265":0,"266":0,"334":0,"349":0,"355":0,"370":0,"379":0,"380":0,"381":0,"382":0,"383":0,"384":0,"385":0,"386":0,"396":0,"407":0,"411":0,"412":0,"413":0,"414":0,"415":0,"416":0,"419":0,"420":0,"421":0,"434":0,"443":0,"444":0,"445":0,"446":0,"447":0,"450":0,"460":0,"461":0,"462":0,"463":0,"465":0,"466":0,"536":0};
_yuitest_coverage["build/gallery-fwt-treeview/gallery-fwt-treeview.js"].functions = {"cName:9":0,"initializer:96":0,"renderUI:106":0,"bindUI:116":0,"_onKeyDown:126":0,"_afterFocus:243":0,"(anonymous 2):258":0,"loop:257":0,"_rebuildSequence:255":0,"initializer:354":0,"_afterExpandedChanged:369":0,"_afterClick:378":0,"toggleSelection:395":0,"(anonymous 3):420":0,"_afterSelectedChange:406":0,"_ariaCheckedGetter:433":0,"(anonymous 4):446":0,"_dynamicLoadReturn:442":0,"(anonymous 5):461":0,"_childSelectedChange:459":0,"validator:535":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-fwt-treeview/gallery-fwt-treeview.js"].coveredLines = 121;
_yuitest_coverage["build/gallery-fwt-treeview/gallery-fwt-treeview.js"].coveredFunctions = 22;
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 1);
YUI.add('gallery-fwt-treeview', function (Y, NAME) {

_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 3);
'use strict';
/*jslint white: true */
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 5);
var Lang = Y.Lang,
	YArray = Y.Array,
    FWTV,
	getCName = Y.ClassNameManager.getClassName,
	cName = function (name) {
		_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "cName", 9);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 10);
return getCName('fw-treeview', name);
	},
	CNAMES = {
		cname_toggle: cName('toggle'),
		cname_icon: cName('icon'),
		cname_selection: cName('selection'),
		// cname_content: cName('content'),
		cname_sel_prefix: cName('selected-state'),
        cname_label: cName('label')
	},
	CBX = 'contentBox',
    EXPANDED = 'expanded',
    SELECTED = 'selected',
    CHANGE = 'Change',
	NOT_SELECTED = 0,
	PARTIALLY_SELECTED = 1,
	FULLY_SELECTED = 2;
/** Creates a Treeview using the FlyweightTreeManager Widget to handle its nodes.
 * It creates the tree based on an object passed as the `tree` attribute in the constructor.
 * @example
 *
	var tv = new Y.FWTreeView({tree: [
		{
			label:'label 0',
			children: [
				{
					label: 'label 0-0',
					children: [
						{label: 'label 0-0-0'},
						{label: 'label 0-0-1'}
					]
				},
				{label: 'label 0-1'}
			]
		},
		{label: 'label 1'}

	]});
	tv.render('#container');

 * @module gallery-fwt-treeview
 */
/**
 * @class FWTreeView
 * @extends FlyweightTreeManager
 * @constructor
 * @param config {Object} Configuration attributes, amongst them:
 * @param config.tree {Array} Array of objects defining the first level of nodes.
 * @param config.tree.label {String} Text of HTML markup to be shown in the node
 * @param [config.tree.expanded=true] {Boolean} Whether the children of this node should be visible.
 * @param [config.tree.children] {Array} Further definitions for the children of this node
 * @param [config.tree.type=FWTreeNode] {FWTreeNode | String} Class used to create instances for this node.
 * It can be a reference to an object or a name that can be resolved as `Y[name]`.
 * @param [config.tree.id=Y.guid()] {String} Identifier to assign to the DOM element containing this node.
 * @param [config.tree.template] {String} Template for this particular node.
 */
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 66);
FWTV = Y.Base.create(
	NAME,
	Y.FlyweightTreeManager,
	[],
	{
        /**
         * Array of iNodes containing a flat list of all nodes visible regardless
         * of their depth in the tree.
         * Used to handle keyboard navigation.
         * @property _visibleSequence
         * @type Array or null
         * @default null
         * @private
         */
        _visibleSequence: null,
        /**
         * Index, within {{#crossLink "_visibleSequence"}}{{/crossLink}}, of the iNode having the focus.
         * Used for keyboard navigation.
         * @property _visibleIndex
         * @type Integer
         * @default null
         * @private
         */
        _visibleIndex: null,
		/**
		 * Widget lifecycle method
		 * @method initializer
		 * @param config {object} configuration object of which
		 * `tree` contains the tree configuration.
		 */
		initializer: function (config) {
			_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "initializer", 96);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 97);
this._domEvents = ['click'];
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 98);
this._loadConfig(config.tree);
		},
		/**
		 * Widget lifecyle method.
         * Adds the `tree` role to the content box.
		 * @method renderUI
		 * @protected
		 */
		renderUI: function () {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "renderUI", 106);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 107);
FWTV.superclass.renderUI.apply(this, arguments);
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 108);
this.get(CBX).set('role','tree');
		},
		/**
		 * Widget lifecyle method.
         * Sets the keydown listener to handle keyboard navigation.
		 * @method bindUI
		 * @protected
		 */
        bindUI: function () {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "bindUI", 116);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 117);
FWTV.superclass.bindUI.apply(this, arguments);
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 118);
this._eventHandles.push(this.get(CBX).on('keydown', this._onKeyDown, this));
        },
        /**
         * Listener for keyboard events to handle keyboard navigation
         * @method _onKeyDown
         * @param ev {EventFacade} Standard YUI key facade
         * @private
         */
        _onKeyDown: function (ev) {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_onKeyDown", 126);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 127);
var ch = ev.charCode,
                iNode = this._focusedINode,
                seq = this._visibleSequence,
                index = this._visibleIndex,
                fwNode;

            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 133);
switch (ch) {
                case 38: // up
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 135);
if (!seq) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 136);
seq = this._rebuildSequence();
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 137);
index = seq.indexOf(iNode);
                    }
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 139);
index -=1;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 140);
if (index >= 0) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 141);
iNode = seq[index];
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 142);
this._visibleIndex = index;
                    } else {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 144);
iNode = null;
                    }
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 146);
break;
                case 39: // right
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 148);
if (iNode.expanded) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 149);
if (iNode.children && iNode.children.length) {
                            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 150);
iNode = iNode.children[0];
                        } else {
                            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 152);
iNode = null;
                        }
                    } else {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 155);
this._poolReturn(this._poolFetch(iNode).set(EXPANDED, true));
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 156);
iNode = null;
                    }

                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 159);
break;
                case 40: // down
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 161);
if (!seq) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 162);
seq = this._rebuildSequence();
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 163);
index = seq.indexOf(iNode);
                    }
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 165);
index +=1;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 166);
if (index < seq.length) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 167);
iNode = seq[index];
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 168);
this._visibleIndex = index;
                    } else {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 170);
iNode = null;
                    }
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 172);
break;
                case 37: // left
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 174);
if (iNode.expanded && iNode.children) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 175);
this._poolReturn(this._poolFetch(iNode).set(EXPANDED, false));
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 176);
iNode = null;
                    } else {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 178);
iNode = iNode._parent;
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 179);
if (iNode === this._tree) {
                            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 180);
iNode = null;
                        }
                    }

                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 184);
break;
                case 36: // home
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 186);
iNode = this._tree.children && this._tree.children[0];
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 187);
break;
                case 35: // end
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 189);
index = this._tree.children && this._tree.children.length;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 190);
if (index) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 191);
iNode = this._tree.children[index -1];
                    } else {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 193);
iNode = null;
                    }
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 195);
break;
                case 13: // enter
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 197);
fwNode = this._poolFetch(iNode);
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 198);
this.fire('enterkey', {
                        domEvent:ev,
                        node: fwNode
                    });
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 202);
fwNode.fire('enterkey', {
                        domEvent:ev,
                        node: fwNode
                    });
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 206);
this._poolReturn(fwNode);
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 207);
iNode = null;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 208);
break;
                case 32: // spacebar
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 210);
fwNode = this._poolFetch(iNode);
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 211);
this.fire('spacebar', {
                        domEvent:ev,
                        node: fwNode
                    });
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 215);
fwNode.fire('spacebar', {
                        domEvent:ev,
                        node: fwNode
                    });
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 219);
this._poolReturn(fwNode);
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 220);
iNode = null;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 221);
break;
                case 106: // asterisk on the numeric keypad
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 223);
this.expandAll();
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 224);
break;
                default: // initial
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 226);
iNode = null;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 227);
break;
            }
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 229);
if (iNode) {
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 230);
this._focusOnINode(iNode);
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 231);
ev.halt();
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 232);
return false;
            }
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 234);
return true;
        },
        /**
         * Listener for the focus event.
         * Updates the node receiving the focus when the widget gets the focus.
         * @method _aferFocus
         * @param ev {EventFacade} Standard event facade
         * @private
         */
        _afterFocus: function (ev) {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_afterFocus", 243);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 244);
var iNode = this._findINodeByElement(ev.domEvent.target);
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 245);
this._focusOnINode(iNode);
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 246);
if (this._visibleSequence) {
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 247);
this._visibleIndex = this._visibleSequence.indexOf(iNode);
            }
        },
        /**
         * Rebuilds the array of {{#crossLink "_visibleSequence"}}{{/crossLink}} that can be traversed with the up/down arrow keys
         * @method _rebuildSequence
         * @private
         */
        _rebuildSequence: function () {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_rebuildSequence", 255);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 256);
var seq = [],
                loop = function(iNode) {
                    _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "loop", 257);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 258);
YArray.each(iNode.children || [], function(childINode) {
                        _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 2)", 258);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 259);
seq.push(childINode);
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 260);
if (childINode.expanded) {
                            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 261);
loop(childINode);
                        }
                    });
                };
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 265);
loop(this._tree);
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 266);
return (this._visibleSequence = seq);

        },
		/**
		 * Overrides the default CONTENT_TEMPLATE to make it an unordered list instead of a div
		 * @property CONTENT_TEMPLATE
		 * @type String
		 */
		CONTENT_TEMPLATE: '<ul></ul>'

	},
	{
		ATTRS: {
			/**
			 * Override for the `defaultType` value of FlyweightTreeManager
			 * so it creates FWTreeNode instances instead of the default.
			 * @attribute defaultType
			 * @type String
			 * @default 'FWTreeNode'
			 */
			defaultType: {
				value: 'FWTreeNode'
			},
			/**
			 * Enables toggling by clicking on the label item instead of just the toggle icon.
			 * @attribute toggleOnLabelClick
			 * @type Boolean
			 * @value false
			 */
			toggleOnLabelClick: {
				value:false,
				validator:Lang.isBoolean
			}


		}

	}
);

/**
 * TreeView provides all the events that Widget relays from the DOM.
 * It adds an additional property to the EventFacade called `node`
 * that points to the TreeNode instance that received the event.
 *
 * This instance is pooled and will be discarded upon return from the listener.
 * If you need to hold on to this instance,
 * use the {{#crossLink "TreeNode/hold"}}{{/crossLink}} method to preserve it.
 * @event -any-
 * @param type {String} The full name of the event fired
 * @param ev {EventFacade} Standard YUI event facade for DOM events plus:
 * @param ev.node {TreeNode} TreeNode instance that received the event
 */
/**
 * Fires when the space bar is pressed.
 * Used internally to toggle node selection.
 * @event spacebar
 * @param ev {EventFacade} YUI event facade for keyboard events, including:
 * @param ev.domEvent {Object} The original event produced by the DOM
 * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed
 */
/**
 * Fires when the enter key is pressed.
 * @event enterkey
 * @param ev {EventFacade} YUI event facade for keyboard events, including:
 * @param ev.domEvent {Object} The original event produced by the DOM
 * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed
 */
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 334);
Y.FWTreeView = FWTV;/** This class must not be generated directly.
 *  Instances of it will be provided by FWTreeView as required.
 *
 *  Subclasses might be defined based on it.
 *  Usually, they will add further attributes and redefine the TEMPLATE to
 *  show those extra attributes.
 *
 *  @module gallery-fwt-treeview
 */
/**
 *
 *  @class FWTreeNode
 *  @extends FlyweightTreeNode
 *  @constructor
 */
 _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 349);
Y.FWTreeNode = Y.Base.create(
	'fw-treenode',
	Y.FlyweightTreeNode,
	[],
	{
		initializer: function() {
			_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "initializer", 354);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 355);
this._root._eventHandles.push(
                this.after('click', this._afterClick),
                this.after(SELECTED + CHANGE, this._afterSelectedChange),
                this.after('spacebar', this.toggleSelection),
                this.after(EXPANDED + CHANGE, this._afterExpandedChanged)
            );
		},
        /**
         * Listens to changes in the expanded attribute to invalidate and force
         * a rebuild of the list of visible nodes
         * the user can navigate through via the keyboard.
         * @method _afterExpandedChanged
         * @protected
         */
        _afterExpandedChanged: function () {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_afterExpandedChanged", 369);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 370);
this._root._visibleSequence = null;
        },
		/**
		 * Responds to the click event by toggling the node
		 * @method _afterClick
		 * @param ev {EventFacade}
		 * @private
		 */
		_afterClick: function (ev) {
			_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_afterClick", 378);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 379);
var target = ev.domEvent.target;
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 380);
if (target.hasClass(CNAMES.cname_toggle)) {
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 381);
this.toggle();
			} else {_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 382);
if (target.hasClass(CNAMES.cname_selection)) {
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 383);
this.toggleSelection();
			} else {_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 384);
if (target.hasClass(CNAMES.cname_content) || target.hasClass(CNAMES.cname_icon)) {
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 385);
if (this.get('root').get('toggleOnLabelClick')) {
					_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 386);
this.toggle();
				}
			}}}
		},
		/**
		 * Sugar method to toggle the selected state of a node.
         * See {{#crossLink "selected:attribute"}}{{/crossLink}}.
		 * @method toggleSelection
		 */
		toggleSelection: function() {
			_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "toggleSelection", 395);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 396);
this.set(SELECTED, (this.get(SELECTED)?NOT_SELECTED:FULLY_SELECTED));
		},
		/**
		 * Changes the UI to reflect the selected state and propagates the selection up and/or down.
		 * @method _afterSelectedChange
		 * @param ev {EventFacade} out of which
		 * @param ev.src {String} if not undefined it can be `'propagateUp'` or `'propagateDown'`
         * so that propagation goes in just one direction and doesn't bounce back.
		 * @private
		 */
		_afterSelectedChange: function (ev) {
			_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_afterSelectedChange", 406);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 407);
var selected = ev.newVal,
                prefix = CNAMES.cname_sel_prefix + '-',
                el;

			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 411);
if (!this.isRoot()) {
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 412);
el = Y.one('#' + this.get('id'));
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 413);
el.replaceClass(prefix + ev.prevVal, prefix + selected);
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 414);
el.set('aria-checked', this._ariaCheckedGetter());
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 415);
if (this.get('propagateUp') && ev.src !== 'propagatingDown') {
					_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 416);
this.getParent()._childSelectedChange().release();
				}
			}
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 419);
if (this.get('propagateDown') && ev.src !== 'propagatingUp') {
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 420);
this.forSomeChildren(function(node) {
					_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 3)", 420);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 421);
node.set(SELECTED , selected, 'propagatingDown');
				});
			}
		},
        /**
         * Getter for the {{#crossLink "_aria_checked:attribute"}}{{/crossLink}}.
         * Translate the internal {{#crossLink "selected:attribute"}}{{/crossLink}}
         * to the strings the `aria_checked` attribute expects
         * @method _ariaCheckedGetter
         * @return {String} One of 'false', 'true' or 'mixed'
         * @private
         */
        _ariaCheckedGetter: function () {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_ariaCheckedGetter", 433);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 434);
return ['false','mixed','true'][this.get(SELECTED)];
        },
		/**
		 * Overrides the original in FlyweightTreeNode so as to propagate the selected state
		 * on dynamically loaded nodes.
		 * @method _dynamicLoadReturn
		 * @private
		 */
		_dynamicLoadReturn: function () {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_dynamicLoadReturn", 442);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 443);
Y.FWTreeNode.superclass._dynamicLoadReturn.apply(this, arguments);
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 444);
if (this.get('propagateDown')) {
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 445);
var selected = this.get(SELECTED);
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 446);
this.forSomeChildren(function(node) {
					_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 4)", 446);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 447);
node.set(SELECTED , selected, 'propagatingDown');
				});
			}
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 450);
this._root._visibleSequence = null;

		},
		/**
		 * When propagating selection up, it is called by a child when changing its selected state
		 * so that the parent adjusts its own state accordingly.
		 * @method _childSelectedChange
		 * @private
		 */
		_childSelectedChange: function () {
			_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_childSelectedChange", 459);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 460);
var count = 0, selCount = 0;
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 461);
this.forSomeChildren(function (node) {
				_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 5)", 461);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 462);
count +=2;
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 463);
selCount += node.get(SELECTED);
			});
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 465);
this.set(SELECTED, (selCount === 0?NOT_SELECTED:(selCount === count?FULLY_SELECTED:PARTIALLY_SELECTED)), {src:'propagatingUp'});
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 466);
return this;
		}

	},
	{
		/**
		 * Template to produce the markup for a node in the tree.
		 * @property TEMPLATE
		 * @type String
		 * @static
		 */
		TEMPLATE: Lang.sub(
            '<li id="{id}" class="{cname_node} {cname_sel_prefix}-{selected}" ' +
                'role="treeitem" aria-expanded="{expanded}" aria-checked="{_aria_checked}">' +
            '<div tabIndex="{tabIndex}" class="{cname_content}"><div class="{cname_toggle}"></div>' +
            '<div class="{cname_icon}"></div><div class="{cname_selection}"></div><div class="{cname_label}">{label}</div></div>' +
            '<ul class="{cname_children}" role="group">{children}</ul></li>', CNAMES),
		/**
		 * Constant to use with the `selected` attribute to indicate the node is not selected.
		 * @property NOT_SELECTED
		 * @type integer
		 * @value 0
		 * @static
		 * @final
		 */
		NOT_SELECTED:NOT_SELECTED,
		/**
		 * Constant to use with the `selected` attribute to indicate some
		 * but not all of the children of this node are selected.
		 * This state should only be acquired by upward propagation from descendants.
		 * @property PARTIALLY_SELECTED
		 * @type integer
		 * @value 1
		 * @static
		 * @final
		 */
		PARTIALLY_SELECTED:PARTIALLY_SELECTED,
		/**
		 * Constant to use with the `selected` attribute to indicate the node is selected.
		 * @property FULLY_SELECTED
		 * @type integer
		 * @value 2
		 * @static
		 * @final
		 */
		FULLY_SELECTED:FULLY_SELECTED,
		ATTRS: {
			/**
			 * Selected/highlighted state of the node.
             *
             * The node selection mechanism is always enabled though it might not be visible.
             * It only sets a suitable className on the tree node.
             * The module is provided with a default CSS style that makes node selection visible.
             * To enable it, add the `yui3-fw-treeview-checkbox` className to the container of the tree.
             *
			 * `selected` can be
			 *
			 * - Y.FWTreeNode.NOT_SELECTED (0) not selected
			 * - Y.FWTreeNode.PARTIALLY_SELECTED (1) partially selected: some children are selected, some not or partially selected.
			 * - Y.FWTreeNode.FULLY_SELECTED (2) fully selected.
			 *
			 * The partially selected state can only be the result of selection propagating up from a child node.
			 * The attribute might return PARTIALLY_SELECTED but the developer should never set that value.
			 * @attribute selected
			 * @type Integer
			 * @value NOT_SELECTED
			 */
			selected: {
				value:NOT_SELECTED,
				validator:function (value) {
					_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "validator", 535);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 536);
return value === NOT_SELECTED || value === FULLY_SELECTED || value === PARTIALLY_SELECTED;
				}
			},
            /**
             * String value equivalent to the {{#crossLink "selected:attribute"}}{{/crossLink}}
             * for use in template expansion.
             * @attribute _aria_checked
             * @type String
             * @default false
             * @readonly
             * @protected
             */
            _aria_checked: {
                readOnly: true,
                getter: '_ariaCheckedGetter'
            },
			/**
			 * Whether selection of one node should propagate to its parent.
             * See {{#crossLink "selected:attribute"}}{{/crossLink}}.
			 * @attribute propagateUp
			 * @type Boolean
			 * @value true
			 */
			propagateUp: {
				value: true,
				validator: Lang.isBoolean
			},
			/**
			 * Whether selection of one node should propagate to its children.
             * See {{#crossLink "selected:attribute"}}{{/crossLink}}.
             * @attribute propagateDown
			 * @type Boolean
			 * @value true
			 */
			propagateDown: {
				value: true,
				validator: Lang.isBoolean
			}
		}
	}
);

/**
 * Fires when the space bar is pressed.
 * Used internally to toggle node selection.
 * @event spacebar
 * @param ev {EventFacade} YUI event facade for keyboard events, including:
 * @param ev.domEvent {Object} The original event produced by the DOM
 * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed
 */
/**
 * Fires when the enter key is pressed.
 * @event enterkey
 * @param ev {EventFacade} YUI event facade for keyboard events, including:
 * @param ev.domEvent {Object} The original event produced by the DOM
 * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed
 */
/**
 * Fires when this node is clicked.
 * Used internally to toggle expansion or selection when clicked
 * on the corresponding icons.
 *
 * It cannot be prevented.  This is a helper event, the actual event
 * happens on the TreeView instance and it is relayed here for convenience.
 * @event click
 * @param ev {EventFacade} Standard YUI event facade for mouse events.
 */

}, '@VERSION@', {"requires": ["gallery-flyweight-tree", "widget", "base-build"], "skinnable": true});
