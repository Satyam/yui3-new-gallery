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
_yuitest_coverage["build/gallery-fwt-treeview/gallery-fwt-treeview.js"].code=["YUI.add('gallery-fwt-treeview', function (Y, NAME) {","","/**"," * Creates a Treeview using the FlyweightTreeManager Widget to handle its nodes."," * It creates the tree based on an object passed as the `tree` attribute in the constructor."," * @example"," *","	var tv = new Y.FWTreeView({tree: [","		{","			label:'label 0',","			children: [","				{","					label: 'label 0-0',","					children: [","						{label: 'label 0-0-0'},","						{label: 'label 0-0-1'}","					]","				},","				{label: 'label 0-1'}","			]","		},","		{label: 'label 1'}","","	]});","	tv.render('#container');",""," * @module gallery-fwt-treeview"," */","'use strict';","/*jslint white: true */","var Lang = Y.Lang,","	YArray = Y.Array,","    FWTV,","    FWTN,","	getCName = Y.ClassNameManager.getClassName,","	cName = function (name) {","		return getCName('fw-treeview', name);","	},","	CBX = 'contentBox',","    EXPANDED = 'expanded',","    SEL_ENABLED = 'selectionEnabled',","    SELECTED = 'selected',","    CHANGE = 'Change',","	NOT_SELECTED = 0,","	PARTIALLY_SELECTED = 1,","	FULLY_SELECTED = 2;","/**"," * TreeView widget."," * It creates the tree based on an object passed as the `tree` attribute in the constructor."," * @example"," *","	var tv = new Y.FWTreeView({tree: [","		{","			label:'label 0',","			children: [","				{","					label: 'label 0-0',","					children: [","						{label: 'label 0-0-0'},","						{label: 'label 0-0-1'}","					]","				},","				{label: 'label 0-1'}","			]","		},","		{label: 'label 1'}","","	]});","	tv.render('#container');",""," *"," * @class FWTreeView"," * @extends FlyweightTreeManager"," * @constructor"," * @param config {Object} Configuration attributes, amongst them:"," * @param config.tree {Array} Array of strings or objects defining the first level of nodes."," * If a string, it will be used as the label, if an object, it may contain:"," * @param config.tree.label {String} Text of HTML markup to be shown in the node"," * @param [config.tree.expanded=true] {Boolean} Whether the children of this node should be visible."," * @param [config.tree.children] {Array} Further definitions for the children of this node"," * @param [config.tree.type=FWTreeNode] {FWTreeNode | String} Class used to create instances for this node."," * It can be a reference to an object or a name that can be resolved as `Y[name]`."," * @param [config.tree.id=Y.guid()] {String} Identifier to assign to the DOM element containing this node."," * @param [config.tree.template] {String} Template for this particular node."," */","FWTV = Y.Base.create(","	NAME,","	Y.FlyweightTreeManager,","	[],","	{","        /**","         * Array of iNodes containing a flat list of all nodes visible regardless","         * of their depth in the tree.","         * Used to handle keyboard navigation.","         * @property _visibleSequence","         * @type Array or null","         * @default null","         * @private","         */","        _visibleSequence: null,","        /**","         * Index, within {{#crossLink \"_visibleSequence\"}}{{/crossLink}}, of the iNode having the focus.","         * Used for keyboard navigation.","         * @property _visibleIndex","         * @type Integer","         * @default null","         * @private","         */","        _visibleIndex: null,","		/**","		 * Widget lifecycle method","		 * @method initializer","		 * @param config {object} configuration object of which","		 * `tree` contains the tree configuration.","		 */","		initializer: function (config) {","			this._domEvents = ['click'];","			this._loadConfig(config.tree);","		},","        /**","         * Overrides the same function to process the selected attribute","         * @method _initNodes","         * @param parentINode {Object} Parent of the iNodes to be set","         * @protected","         */","        _initNodes: function (parentINode) {","            FWTV.superclass._initNodes.call(this, parentINode);","            parentINode.selected = parentINode.selected?FULLY_SELECTED:NOT_SELECTED;","        },","		/**","		 * Widget lifecyle method.","         * Adds the `tree` role to the content box.","		 * @method renderUI","		 * @protected","		 */","		renderUI: function () {","            FWTV.superclass.renderUI.apply(this, arguments);","            this.get(CBX).set('role','tree');","		},","		/**","		 * Widget lifecyle method.","         * Sets the keydown listener to handle keyboard navigation.","		 * @method bindUI","		 * @protected","		 */","        bindUI: function () {","            FWTV.superclass.bindUI.apply(this, arguments);","            this._eventHandles.push(this.get(CBX).on('keydown', this._onKeyDown, this));","        },","        /**","         * Listener for keyboard events to handle keyboard navigation","         * @method _onKeyDown","         * @param ev {EventFacade} Standard YUI key facade","         * @private","         */","        _onKeyDown: function (ev) {","            var self = this,","                key = ev.keyCode,","                iNode = this._focusedINode,","                seq = this._visibleSequence,","                index = this._visibleIndex,","                fwNode,","                fireKey = function (which) {","                    fwNode = self._poolFetch(iNode);","                    ev.container = ev.target;","                    ev.target = Y.one('#' + iNode.id);","                    var newEv = {","                        domEvent:ev,","                        node: fwNode","                    };","                    self.fire(which, newEv);","                    fwNode.fire(which);","                    self._poolReturn(fwNode);","                };","","            switch (key) {","                case 38: // up","                    if (!seq) {","                        seq = this._rebuildSequence();","                        index = seq.indexOf(iNode);","                    }","                    index -=1;","                    if (index >= 0) {","                        iNode = seq[index];","                        self._visibleIndex = index;","                    } else {","                        iNode = null;","                    }","                    break;","                case 39: // right","                    if (iNode.expanded) {","                        if (iNode.children && iNode.children.length) {","                            iNode = iNode.children[0];","                        } else {","                            iNode = null;","                        }","                    } else {","                        self._poolReturn(self._poolFetch(iNode).set(EXPANDED, true));","                        iNode = null;","                    }","","                    break;","                case 40: // down","                    if (!seq) {","                        seq = self._rebuildSequence();","                        index = seq.indexOf(iNode);","                    }","                    index +=1;","                    if (index < seq.length) {","                        iNode = seq[index];","                        self._visibleIndex = index;","                    } else {","                        iNode = null;","                    }","                    break;","                case 37: // left","                    if (iNode.expanded && iNode.children) {","                        self._poolReturn(self._poolFetch(iNode).set(EXPANDED, false));","                        iNode = null;","                    } else {","                        iNode = iNode._parent;","                        if (iNode === self._tree) {","                            iNode = null;","                        }","                    }","","                    break;","                case 36: // home","                    iNode = self._tree.children && self._tree.children[0];","                    break;","                case 35: // end","                    index = self._tree.children && self._tree.children.length;","                    if (index) {","                        iNode = self._tree.children[index -1];","                    } else {","                        iNode = null;","                    }","                    break;","                case 13: // enter","                    fireKey('enterkey');","                    iNode = null;","                    break;","                case 32: // spacebar","                    fireKey('spacebar');","                    iNode = null;","                    break;","                case 106: // asterisk on the numeric keypad","                    self.expandAll();","                    break;","                default: // initial","                    iNode = null;","                    break;","            }","            if (iNode) {","                self._focusOnINode(iNode);","                ev.halt();","                return false;","            }","            return true;","        },","        /**","         * Listener for the focus event.","         * Updates the node receiving the focus when the widget gets the focus.","         * @method _aferFocus","         * @param ev {EventFacade} Standard event facade","         * @private","         */","        _afterFocus: function (ev) {","            var iNode = this._findINodeByElement(ev.domEvent.target);","            this._focusOnINode(iNode);","            if (this._visibleSequence) {","                this._visibleIndex = this._visibleSequence.indexOf(iNode);","            }","        },","        /**","         * Rebuilds the array of {{#crossLink \"_visibleSequence\"}}{{/crossLink}} that can be traversed with the up/down arrow keys","         * @method _rebuildSequence","         * @private","         */","        _rebuildSequence: function () {","            var seq = [],","                loop = function(iNode) {","                    YArray.each(iNode.children || [], function(childINode) {","                        seq.push(childINode);","                        if (childINode.expanded) {","                            loop(childINode);","                        }","                    });","                };","            loop(this._tree);","            return (this._visibleSequence = seq);","","        },","		/**","		 * Overrides the default CONTENT_TEMPLATE to make it an unordered list instead of a div","		 * @property CONTENT_TEMPLATE","		 * @type String","		 */","		CONTENT_TEMPLATE: '<ul></ul>'","","	},","	{","		ATTRS: {","			/**","			 * Override for the `defaultType` value of FlyweightTreeManager","			 * so it creates FWTreeNode instances instead of the default.","			 * @attribute defaultType","			 * @type String","			 * @default 'FWTreeNode'","			 */","			defaultType: {","				value: 'FWTreeNode'","			},","			/**","			 * Enables toggling by clicking on the label item instead of just the toggle icon.","			 * @attribute toggleOnLabelClick","			 * @type Boolean","			 * @default false","			 */","			toggleOnLabelClick: {","				value:false,","				validator:Lang.isBoolean","			}","		}","	}",");","","/**"," * TreeView provides all the events that Widget relays from the DOM."," * It adds an additional property to the EventFacade called `node`"," * that points to the TreeNode instance that received the event."," *"," * This instance is pooled and will be discarded upon return from the listener."," * If you need to hold on to this instance,"," * use the {{#crossLink \"TreeNode/hold\"}}{{/crossLink}} method to preserve it."," * @event -any DOM event-"," * @param type {String} The full name of the event fired"," * @param ev {EventFacade} Standard YUI event facade for DOM events plus:"," * @param ev.node {TreeNode} TreeNode instance that received the event"," */","/**"," * Fires when the space bar is pressed."," * Used internally to toggle node selection."," * @event spacebar"," * @param ev {EventFacade} YUI event facade for keyboard events, including:"," * @param ev.domEvent {Object} The original event produced by the DOM, except:"," * @param ev.domEvent.target {Node} The DOM element that had the focus when the key was pressed"," * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed"," */","/**"," * Fires when the enter key is pressed."," * @event enterkey"," * @param ev {EventFacade} YUI event facade for keyboard events, including:"," * @param ev.domEvent {Object} The original event produced by the DOM, except:"," * @param ev.domEvent.target {Node} The DOM element that had the focus when the key was pressed"," * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed"," */","Y.FWTreeView = FWTV;/**"," *  This class must not be generated directly."," *  Instances of it will be provided by FWTreeView as required."," *"," *  Subclasses might be defined based on it."," *  Usually, they will add further attributes and redefine the TEMPLATE to"," *  show those extra attributes."," *"," *  @class FWTreeNode"," *  @extends FlyweightTreeNode"," *  @constructor"," */"," FWTN = Y.Base.create(","	'fw-treenode',","	Y.FlyweightTreeNode,","	[],","	{","		initializer: function() {","			this._root._eventHandles.push(","                this.after('click', this._afterClick),","                this.after(SELECTED + CHANGE, this._afterSelectedChange),","                this.after('spacebar', this.toggleSelection),","                this.after(EXPANDED + CHANGE, this._afterExpandedChanged)","            );","		},","        /**","         * Listens to changes in the expanded attribute to invalidate and force","         * a rebuild of the list of visible nodes","         * the user can navigate through via the keyboard.","         * @method _afterExpandedChanged","         * @protected","         */","        _afterExpandedChanged: function () {","            this._root._visibleSequence = null;","        },","		/**","		 * Responds to the click event by toggling the node","		 * @method _afterClick","		 * @param ev {EventFacade}","		 * @private","		 */","		_afterClick: function (ev) {","			var target = ev.domEvent.target,","                CNAMES = FWTN.CNAMES;","			if (target.hasClass(CNAMES.CNAME_TOGGLE)) {","				this.toggle();","			} else if (target.hasClass(CNAMES.CNAME_SELECTION)) {","				this.toggleSelection();","			} else if (target.hasClass(CNAMES.CNAME_LABEL) || target.hasClass(CNAMES.CNAME_ICON)) {","				if (this.get('root').get('toggleOnLabelClick')) {","					this.toggle();","				}","			}","		},","		/**","		 * Sugar method to toggle the selected state of a node.","         * See {{#crossLink \"selected:attribute\"}}{{/crossLink}}.","		 * @method toggleSelection","		 */","		toggleSelection: function() {","			this.set(SELECTED, (this.get(SELECTED)?NOT_SELECTED:FULLY_SELECTED));","		},","		/**","		 * Responds to the change in the {{#crossLink \"label:attribute\"}}{{/crossLink}} attribute.","		 * @method _afterLabelChange","		 * @param ev {EventFacade} standard attribute change event facade","		 * @private","		 */","        _afterLabelChange: function (ev) {","            var el = Y.one('#' + this._iNode.id + ' .' + FWTN.CNAMES.CNAME_LABEL);","            if (el) {","                el.setHTML(ev.newVal);","            }","        },		/**","		 * Changes the UI to reflect the selected state and propagates the selection up and/or down.","		 * @method _afterSelectedChange","		 * @param ev {EventFacade} out of which","		 * @param ev.src {String} if not undefined it can be `'propagateUp'` or `'propagateDown'`","         * so that propagation goes in just one direction and doesn't bounce back.","		 * @private","		 */","		_afterSelectedChange: function (ev) {","			var selected = ev.newVal,","                prefix = FWTN.CNAMES.CNAME_SEL_PREFIX + '-',","                el;","            if (!this.get(SEL_ENABLED)) {","                return;","            }","			if (!this.isRoot()) {","				el = Y.one('#' + this.get('id'));","                if (el) {","                    el.replaceClass(prefix + ev.prevVal, prefix + selected);","                    el.set('aria-checked', this._ariaCheckedGetter());","                }","				if (this.get('propagateUp') && ev.src !== 'propagatingDown') {","					this.getParent()._childSelectedChange().release();","				}","                if (this.get('propagateDown') && ev.src !== 'propagatingUp') {","                    this.forSomeChildren(function(node) {","                        node.set(SELECTED , selected, 'propagatingDown');","                    });","                }","			}","        },","        /**","         * Getter for the {{#crossLink \"_aria_checked:attribute\"}}{{/crossLink}}.","         * Translate the internal {{#crossLink \"selected:attribute\"}}{{/crossLink}}","         * to the strings the `aria_checked` attribute expects","         * @method _ariaCheckedGetter","         * @return {String} One of 'false', 'true' or 'mixed'","         * @private","         */","        _ariaCheckedGetter: function () {","            return ['false','mixed','true'][this.get(SELECTED) ||0];","        },","        /**","         * Setter for the {{ćrossLink \"selected:attribute}}{{/crossLink}}.","         * Translates a truish or falsy value into FULLY_SELECTED or NOT_SELECTED.","         * @method _selectedSetter","         * @param value","         * @private","         */","        _selectedSetter: function (value) {","            return (value?FULLY_SELECTED:NOT_SELECTED);","        },","        /**","         * Getter for the `selected` attribute.","         * Returns false when selection is not enabled.","         * @method _selectedGetter","         * @param value {integer} current value","         * @return {integer} current value or false if not enabled","         * @private","         */","        _selectedGetter: function (value) {","            return (this.get(SEL_ENABLED)?value||0:null);","        },","        /**","         * Getter for both the `propagateUp` and `propagateDown` attributes.","         * @method _propagateGetter","         * @param value {Boolean} current value","         * @return {Boolean} the state of the attribute","         * @private","         */","        _propagateGetter: function (value) {","            return (this.get(SEL_ENABLED)?(value !== false):false);","        },","		/**","		 * Overrides the original in FlyweightTreeNode so as to propagate the selected state","		 * on dynamically loaded nodes.","		 * @method _dynamicLoadReturn","		 * @private","		 */","		_dynamicLoadReturn: function () {","            FWTN.superclass._dynamicLoadReturn.apply(this, arguments);","			if (this.get('propagateDown')) {","				var selected = this.get(SELECTED);","				this.forSomeChildren(function(node) {","					node.set(SELECTED , selected, 'propagatingDown');","				});","			}","            this._root._visibleSequence = null;","","		},","		/**","		 * When propagating selection up, it is called by a child when changing its selected state","		 * so that the parent adjusts its own state accordingly.","		 * @method _childSelectedChange","		 * @private","		 */","		_childSelectedChange: function () {","			var count = 0, selCount = 0, value;","			this.forSomeChildren(function (node) {","				count +=2;","				selCount += node.get(SELECTED);","			});","            // While this is not solved:  http://yuilibrary.com/projects/yui3/ticket/2532810","            // This is the good line:","			//this.set(SELECTED, (selCount === 0?NOT_SELECTED:(selCount === count?FULLY_SELECTED:PARTIALLY_SELECTED)), {src:'propagatingUp'});","            // This is the patch:","            value = (selCount === 0?NOT_SELECTED:(selCount === count?FULLY_SELECTED:PARTIALLY_SELECTED));","            this._afterSelectedChange({","                prevVal: this._iNode.selected,","                newVal: value,","                src: 'propagatingUp'","            });","            this._iNode.selected = value;","            // end of the patch","			return this;","		}","","	},","	{","		/**","		 * Outer template to produce the markup for a node in the tree.","         * It replaces the standard one provided by FlyweightTreeNode.","         * Adds the proper ARIA role and node selection.","		 * @property OUTER_TEMPLATE","		 * @type String","		 * @static","		 */","		OUTER_TEMPLATE: '<li id=\"{id}\" class=\"{CNAME_NODE} {CNAME_SEL_PREFIX}-{selected}\" ' +","                'role=\"treeitem\" aria-expanded=\"{expanded}\" aria-checked=\"{_aria_checked}\">' +","            '{INNER_TEMPLATE}' +","            '<ul class=\"{CNAME_CHILDREN}\" role=\"group\">{children}</ul></li>',","		/**","		 * Template to produce the markup for a node in the tree.","         * It replaces the standard one provided by FlyweightTreeNode.","         * Adds places for the toggle and selection icons, an extra app-dependent icon and the label.","		 * @property INNER_TEMPLATE","		 * @type String","         *","		 * @static","		 */","		INNER_TEMPLATE: '<div tabIndex=\"{tabIndex}\" class=\"{CNAME_CONTENT}\"><div class=\"{CNAME_TOGGLE}\"></div>' +","            '<div class=\"{CNAME_ICON}\"></div><div class=\"{CNAME_SELECTION}\"></div><div class=\"{CNAME_LABEL}\">{label}</div></div>',","        /**","         * Collection of classNames to set in the template.","         * @property CNAMES","         * @type Object","         * @static","         * @final","         */","        CNAMES: {","            CNAME_TOGGLE: cName('toggle'),","            CNAME_ICON: cName('icon'),","            CNAME_SELECTION: cName('selection'),","            CNAME_SEL_PREFIX: cName('selected-state'),","            CNAME_LABEL: cName('label')","        },","		/**","		 * Constant to use with the `selected` attribute to indicate the node is not selected.","		 * @property NOT_SELECTED","		 * @type integer","		 * @value 0","		 * @static","		 * @final","		 */","		NOT_SELECTED:NOT_SELECTED,","		/**","		 * Constant to use with the `selected` attribute to indicate some","		 * but not all of the children of this node are selected.","		 * This state should only be acquired by upward propagation from descendants.","		 * @property PARTIALLY_SELECTED","		 * @type integer","		 * @value 1","		 * @static","		 * @final","		 */","		PARTIALLY_SELECTED:PARTIALLY_SELECTED,","		/**","		 * Constant to use with the `selected` attribute to indicate the node is selected.","		 * @property FULLY_SELECTED","		 * @type integer","		 * @value 2","		 * @static","		 * @final","		 */","		FULLY_SELECTED:FULLY_SELECTED,","		ATTRS: {","			/**","			 * Selected/highlighted state of the node.","             *","             * The node selection mechanism is always enabled though it might not be visible.","             * It only sets a suitable className on the tree node.","             * The module is provided with a default CSS style that makes node selection visible.","             * To enable it, add the `yui3-fw-treeview-checkbox` className to the container of the tree.","             *","			 * `selected` can return","			 *","			 * - Y.FWTreeNode.NOT\\_SELECTED (0) not selected","			 * - Y.FWTreeNode.PARTIALLY\\_SELECTED (1) partially selected: some children are selected, some not or partially selected.","			 * - Y.FWTreeNode.FULLY\\_SELECTED (2) fully selected.","             * - null when {{#crossLing \"selectionEnabled:attribute\"}}{{/crossLink}} is not enabled","             *","             * `selected`can be set to:","             *","             * - any true value:  will produce a FULLY\\_SELECTED state.","             * - any false value: will produce a NOT\\_SELECTED state.","			 *","			 * The partially selected state can only be the result of selection propagating up from a child node.","			 * Since PARTIALLY\\_SELECTED cannot be set, leaving just two possible values for setting,","             * any true or false value will be valid when setting.  However, no matter what values were","             * used when setting, one of the three possible values above will be returned.","             *","			 * @attribute selected","			 * @type Integer","			 * @default NOT_SELECTED","			 */","			selected: {","				value:NOT_SELECTED,","                setter: '_selectedSetter',","                getter: '_selectedGetter'","			},","            /**","             * String value equivalent to the {{#crossLink \"selected:attribute\"}}{{/crossLink}}","             * for use in template expansion.","             * @attribute _aria_checked","             * @type String","             * @default false","             * @readonly","             * @protected","             */","            _aria_checked: {","                readOnly: true,","                getter: '_ariaCheckedGetter'","            },","            /**","             * Enables node selection. Nodes with selection enabled w","             * @attribute selectEnabled","             * @type Boolean","             * @default true","             */","            selectionEnabled: {","                value: true,","                validator: Lang.isBoolean","            },","			/**","			 * Whether selection of one node should propagate to its parent.","             * See {{#crossLink \"selected:attribute\"}}{{/crossLink}}.","			 * @attribute propagateUp","			 * @type Boolean","			 * @default true","			 */","			propagateUp: {","				value: true,","				validator: Lang.isBoolean,","                getter: '_propagageGetter'","			},","			/**","			 * Whether selection of one node should propagate to its children.","             * See {{#crossLink \"selected:attribute\"}}{{/crossLink}}.","             * @attribute propagateDown","			 * @type Boolean","			 * @default true","			 */","			propagateDown: {","				value: true,","				validator: Lang.isBoolean,","                getter: '_propagageGetter'","			}","		}","	}",");","","/**"," * Fires when the space bar is pressed."," * Used internally to toggle node selection."," * @event spacebar"," * @param ev {EventFacade} YUI event facade for keyboard events, including:"," * @param ev.domEvent {Object} The original event produced by the DOM, except:"," * @param ev.domEvent.target {Node} The DOM element that had the focus when the key was pressed"," * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed"," */","/**"," * Fires when the enter key is pressed."," * @event enterkey"," * @param ev {EventFacade} YUI event facade for keyboard events, including:"," * @param ev.domEvent {Object} The original event produced by the DOM, except:"," * @param ev.domEvent.target {Node} The DOM element that had the focus when the key was pressed"," * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed"," */","/**"," * Fires when this node is clicked."," * Used internally to toggle expansion or selection when clicked"," * on the corresponding icons."," *"," * It cannot be prevented.  This is a helper event, the actual event"," * happens on the TreeView instance and it is relayed here for convenience."," * @event click"," * @param ev {EventFacade} Standard YUI event facade for mouse events."," */","","Y.FWTreeNode = FWTN;","","}, '@VERSION@', {\"requires\": [\"gallery-flyweight-tree\", \"widget\", \"base-build\"], \"skinnable\": true});"];
_yuitest_coverage["build/gallery-fwt-treeview/gallery-fwt-treeview.js"].lines = {"1":0,"29":0,"31":0,"37":0,"86":0,"117":0,"118":0,"127":0,"128":0,"137":0,"138":0,"147":0,"148":0,"157":0,"164":0,"165":0,"166":0,"167":0,"171":0,"172":0,"173":0,"176":0,"178":0,"179":0,"180":0,"182":0,"183":0,"184":0,"185":0,"187":0,"189":0,"191":0,"192":0,"193":0,"195":0,"198":0,"199":0,"202":0,"204":0,"205":0,"206":0,"208":0,"209":0,"210":0,"211":0,"213":0,"215":0,"217":0,"218":0,"219":0,"221":0,"222":0,"223":0,"227":0,"229":0,"230":0,"232":0,"233":0,"234":0,"236":0,"238":0,"240":0,"241":0,"242":0,"244":0,"245":0,"246":0,"248":0,"249":0,"251":0,"252":0,"254":0,"255":0,"256":0,"257":0,"259":0,"269":0,"270":0,"271":0,"272":0,"281":0,"283":0,"284":0,"285":0,"286":0,"290":0,"291":0,"358":0,"370":0,"376":0,"391":0,"400":0,"402":0,"403":0,"404":0,"405":0,"406":0,"407":0,"408":0,"418":0,"427":0,"428":0,"429":0,"440":0,"443":0,"444":0,"446":0,"447":0,"448":0,"449":0,"450":0,"452":0,"453":0,"455":0,"456":0,"457":0,"471":0,"481":0,"492":0,"502":0,"511":0,"512":0,"513":0,"514":0,"515":0,"518":0,"528":0,"529":0,"530":0,"531":0,"537":0,"538":0,"543":0,"545":0,"730":0};
_yuitest_coverage["build/gallery-fwt-treeview/gallery-fwt-treeview.js"].functions = {"cName:36":0,"initializer:116":0,"_initNodes:126":0,"renderUI:136":0,"bindUI:146":0,"fireKey:163":0,"_onKeyDown:156":0,"_afterFocus:268":0,"(anonymous 2):283":0,"loop:282":0,"_rebuildSequence:280":0,"initializer:375":0,"_afterExpandedChanged:390":0,"_afterClick:399":0,"toggleSelection:417":0,"_afterLabelChange:426":0,"(anonymous 3):456":0,"_afterSelectedChange:439":0,"_ariaCheckedGetter:470":0,"_selectedSetter:480":0,"_selectedGetter:491":0,"_propagateGetter:501":0,"(anonymous 4):514":0,"_dynamicLoadReturn:510":0,"(anonymous 5):529":0,"_childSelectedChange:527":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-fwt-treeview/gallery-fwt-treeview.js"].coveredLines = 135;
_yuitest_coverage["build/gallery-fwt-treeview/gallery-fwt-treeview.js"].coveredFunctions = 27;
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 1);
YUI.add('gallery-fwt-treeview', function (Y, NAME) {

/**
 * Creates a Treeview using the FlyweightTreeManager Widget to handle its nodes.
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
_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 29);
'use strict';
/*jslint white: true */
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 31);
var Lang = Y.Lang,
	YArray = Y.Array,
    FWTV,
    FWTN,
	getCName = Y.ClassNameManager.getClassName,
	cName = function (name) {
		_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "cName", 36);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 37);
return getCName('fw-treeview', name);
	},
	CBX = 'contentBox',
    EXPANDED = 'expanded',
    SEL_ENABLED = 'selectionEnabled',
    SELECTED = 'selected',
    CHANGE = 'Change',
	NOT_SELECTED = 0,
	PARTIALLY_SELECTED = 1,
	FULLY_SELECTED = 2;
/**
 * TreeView widget.
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

 *
 * @class FWTreeView
 * @extends FlyweightTreeManager
 * @constructor
 * @param config {Object} Configuration attributes, amongst them:
 * @param config.tree {Array} Array of strings or objects defining the first level of nodes.
 * If a string, it will be used as the label, if an object, it may contain:
 * @param config.tree.label {String} Text of HTML markup to be shown in the node
 * @param [config.tree.expanded=true] {Boolean} Whether the children of this node should be visible.
 * @param [config.tree.children] {Array} Further definitions for the children of this node
 * @param [config.tree.type=FWTreeNode] {FWTreeNode | String} Class used to create instances for this node.
 * It can be a reference to an object or a name that can be resolved as `Y[name]`.
 * @param [config.tree.id=Y.guid()] {String} Identifier to assign to the DOM element containing this node.
 * @param [config.tree.template] {String} Template for this particular node.
 */
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 86);
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
			_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "initializer", 116);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 117);
this._domEvents = ['click'];
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 118);
this._loadConfig(config.tree);
		},
        /**
         * Overrides the same function to process the selected attribute
         * @method _initNodes
         * @param parentINode {Object} Parent of the iNodes to be set
         * @protected
         */
        _initNodes: function (parentINode) {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_initNodes", 126);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 127);
FWTV.superclass._initNodes.call(this, parentINode);
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 128);
parentINode.selected = parentINode.selected?FULLY_SELECTED:NOT_SELECTED;
        },
		/**
		 * Widget lifecyle method.
         * Adds the `tree` role to the content box.
		 * @method renderUI
		 * @protected
		 */
		renderUI: function () {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "renderUI", 136);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 137);
FWTV.superclass.renderUI.apply(this, arguments);
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 138);
this.get(CBX).set('role','tree');
		},
		/**
		 * Widget lifecyle method.
         * Sets the keydown listener to handle keyboard navigation.
		 * @method bindUI
		 * @protected
		 */
        bindUI: function () {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "bindUI", 146);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 147);
FWTV.superclass.bindUI.apply(this, arguments);
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 148);
this._eventHandles.push(this.get(CBX).on('keydown', this._onKeyDown, this));
        },
        /**
         * Listener for keyboard events to handle keyboard navigation
         * @method _onKeyDown
         * @param ev {EventFacade} Standard YUI key facade
         * @private
         */
        _onKeyDown: function (ev) {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_onKeyDown", 156);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 157);
var self = this,
                key = ev.keyCode,
                iNode = this._focusedINode,
                seq = this._visibleSequence,
                index = this._visibleIndex,
                fwNode,
                fireKey = function (which) {
                    _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "fireKey", 163);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 164);
fwNode = self._poolFetch(iNode);
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 165);
ev.container = ev.target;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 166);
ev.target = Y.one('#' + iNode.id);
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 167);
var newEv = {
                        domEvent:ev,
                        node: fwNode
                    };
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 171);
self.fire(which, newEv);
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 172);
fwNode.fire(which);
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 173);
self._poolReturn(fwNode);
                };

            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 176);
switch (key) {
                case 38: // up
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 178);
if (!seq) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 179);
seq = this._rebuildSequence();
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 180);
index = seq.indexOf(iNode);
                    }
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 182);
index -=1;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 183);
if (index >= 0) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 184);
iNode = seq[index];
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 185);
self._visibleIndex = index;
                    } else {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 187);
iNode = null;
                    }
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 189);
break;
                case 39: // right
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 191);
if (iNode.expanded) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 192);
if (iNode.children && iNode.children.length) {
                            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 193);
iNode = iNode.children[0];
                        } else {
                            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 195);
iNode = null;
                        }
                    } else {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 198);
self._poolReturn(self._poolFetch(iNode).set(EXPANDED, true));
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 199);
iNode = null;
                    }

                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 202);
break;
                case 40: // down
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 204);
if (!seq) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 205);
seq = self._rebuildSequence();
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 206);
index = seq.indexOf(iNode);
                    }
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 208);
index +=1;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 209);
if (index < seq.length) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 210);
iNode = seq[index];
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 211);
self._visibleIndex = index;
                    } else {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 213);
iNode = null;
                    }
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 215);
break;
                case 37: // left
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 217);
if (iNode.expanded && iNode.children) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 218);
self._poolReturn(self._poolFetch(iNode).set(EXPANDED, false));
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 219);
iNode = null;
                    } else {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 221);
iNode = iNode._parent;
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 222);
if (iNode === self._tree) {
                            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 223);
iNode = null;
                        }
                    }

                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 227);
break;
                case 36: // home
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 229);
iNode = self._tree.children && self._tree.children[0];
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 230);
break;
                case 35: // end
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 232);
index = self._tree.children && self._tree.children.length;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 233);
if (index) {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 234);
iNode = self._tree.children[index -1];
                    } else {
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 236);
iNode = null;
                    }
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 238);
break;
                case 13: // enter
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 240);
fireKey('enterkey');
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 241);
iNode = null;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 242);
break;
                case 32: // spacebar
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 244);
fireKey('spacebar');
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 245);
iNode = null;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 246);
break;
                case 106: // asterisk on the numeric keypad
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 248);
self.expandAll();
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 249);
break;
                default: // initial
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 251);
iNode = null;
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 252);
break;
            }
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 254);
if (iNode) {
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 255);
self._focusOnINode(iNode);
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 256);
ev.halt();
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 257);
return false;
            }
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 259);
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
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_afterFocus", 268);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 269);
var iNode = this._findINodeByElement(ev.domEvent.target);
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 270);
this._focusOnINode(iNode);
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 271);
if (this._visibleSequence) {
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 272);
this._visibleIndex = this._visibleSequence.indexOf(iNode);
            }
        },
        /**
         * Rebuilds the array of {{#crossLink "_visibleSequence"}}{{/crossLink}} that can be traversed with the up/down arrow keys
         * @method _rebuildSequence
         * @private
         */
        _rebuildSequence: function () {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_rebuildSequence", 280);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 281);
var seq = [],
                loop = function(iNode) {
                    _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "loop", 282);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 283);
YArray.each(iNode.children || [], function(childINode) {
                        _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 2)", 283);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 284);
seq.push(childINode);
                        _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 285);
if (childINode.expanded) {
                            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 286);
loop(childINode);
                        }
                    });
                };
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 290);
loop(this._tree);
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 291);
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
			 * @default false
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
 * @event -any DOM event-
 * @param type {String} The full name of the event fired
 * @param ev {EventFacade} Standard YUI event facade for DOM events plus:
 * @param ev.node {TreeNode} TreeNode instance that received the event
 */
/**
 * Fires when the space bar is pressed.
 * Used internally to toggle node selection.
 * @event spacebar
 * @param ev {EventFacade} YUI event facade for keyboard events, including:
 * @param ev.domEvent {Object} The original event produced by the DOM, except:
 * @param ev.domEvent.target {Node} The DOM element that had the focus when the key was pressed
 * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed
 */
/**
 * Fires when the enter key is pressed.
 * @event enterkey
 * @param ev {EventFacade} YUI event facade for keyboard events, including:
 * @param ev.domEvent {Object} The original event produced by the DOM, except:
 * @param ev.domEvent.target {Node} The DOM element that had the focus when the key was pressed
 * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed
 */
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 358);
Y.FWTreeView = FWTV;/**
 *  This class must not be generated directly.
 *  Instances of it will be provided by FWTreeView as required.
 *
 *  Subclasses might be defined based on it.
 *  Usually, they will add further attributes and redefine the TEMPLATE to
 *  show those extra attributes.
 *
 *  @class FWTreeNode
 *  @extends FlyweightTreeNode
 *  @constructor
 */
 _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 370);
FWTN = Y.Base.create(
	'fw-treenode',
	Y.FlyweightTreeNode,
	[],
	{
		initializer: function() {
			_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "initializer", 375);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 376);
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
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_afterExpandedChanged", 390);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 391);
this._root._visibleSequence = null;
        },
		/**
		 * Responds to the click event by toggling the node
		 * @method _afterClick
		 * @param ev {EventFacade}
		 * @private
		 */
		_afterClick: function (ev) {
			_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_afterClick", 399);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 400);
var target = ev.domEvent.target,
                CNAMES = FWTN.CNAMES;
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 402);
if (target.hasClass(CNAMES.CNAME_TOGGLE)) {
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 403);
this.toggle();
			} else {_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 404);
if (target.hasClass(CNAMES.CNAME_SELECTION)) {
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 405);
this.toggleSelection();
			} else {_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 406);
if (target.hasClass(CNAMES.CNAME_LABEL) || target.hasClass(CNAMES.CNAME_ICON)) {
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 407);
if (this.get('root').get('toggleOnLabelClick')) {
					_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 408);
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
			_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "toggleSelection", 417);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 418);
this.set(SELECTED, (this.get(SELECTED)?NOT_SELECTED:FULLY_SELECTED));
		},
		/**
		 * Responds to the change in the {{#crossLink "label:attribute"}}{{/crossLink}} attribute.
		 * @method _afterLabelChange
		 * @param ev {EventFacade} standard attribute change event facade
		 * @private
		 */
        _afterLabelChange: function (ev) {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_afterLabelChange", 426);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 427);
var el = Y.one('#' + this._iNode.id + ' .' + FWTN.CNAMES.CNAME_LABEL);
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 428);
if (el) {
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 429);
el.setHTML(ev.newVal);
            }
        },		/**
		 * Changes the UI to reflect the selected state and propagates the selection up and/or down.
		 * @method _afterSelectedChange
		 * @param ev {EventFacade} out of which
		 * @param ev.src {String} if not undefined it can be `'propagateUp'` or `'propagateDown'`
         * so that propagation goes in just one direction and doesn't bounce back.
		 * @private
		 */
		_afterSelectedChange: function (ev) {
			_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_afterSelectedChange", 439);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 440);
var selected = ev.newVal,
                prefix = FWTN.CNAMES.CNAME_SEL_PREFIX + '-',
                el;
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 443);
if (!this.get(SEL_ENABLED)) {
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 444);
return;
            }
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 446);
if (!this.isRoot()) {
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 447);
el = Y.one('#' + this.get('id'));
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 448);
if (el) {
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 449);
el.replaceClass(prefix + ev.prevVal, prefix + selected);
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 450);
el.set('aria-checked', this._ariaCheckedGetter());
                }
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 452);
if (this.get('propagateUp') && ev.src !== 'propagatingDown') {
					_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 453);
this.getParent()._childSelectedChange().release();
				}
                _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 455);
if (this.get('propagateDown') && ev.src !== 'propagatingUp') {
                    _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 456);
this.forSomeChildren(function(node) {
                        _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 3)", 456);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 457);
node.set(SELECTED , selected, 'propagatingDown');
                    });
                }
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
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_ariaCheckedGetter", 470);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 471);
return ['false','mixed','true'][this.get(SELECTED) ||0];
        },
        /**
         * Setter for the {{ćrossLink "selected:attribute}}{{/crossLink}}.
         * Translates a truish or falsy value into FULLY_SELECTED or NOT_SELECTED.
         * @method _selectedSetter
         * @param value
         * @private
         */
        _selectedSetter: function (value) {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_selectedSetter", 480);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 481);
return (value?FULLY_SELECTED:NOT_SELECTED);
        },
        /**
         * Getter for the `selected` attribute.
         * Returns false when selection is not enabled.
         * @method _selectedGetter
         * @param value {integer} current value
         * @return {integer} current value or false if not enabled
         * @private
         */
        _selectedGetter: function (value) {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_selectedGetter", 491);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 492);
return (this.get(SEL_ENABLED)?value||0:null);
        },
        /**
         * Getter for both the `propagateUp` and `propagateDown` attributes.
         * @method _propagateGetter
         * @param value {Boolean} current value
         * @return {Boolean} the state of the attribute
         * @private
         */
        _propagateGetter: function (value) {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_propagateGetter", 501);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 502);
return (this.get(SEL_ENABLED)?(value !== false):false);
        },
		/**
		 * Overrides the original in FlyweightTreeNode so as to propagate the selected state
		 * on dynamically loaded nodes.
		 * @method _dynamicLoadReturn
		 * @private
		 */
		_dynamicLoadReturn: function () {
            _yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_dynamicLoadReturn", 510);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 511);
FWTN.superclass._dynamicLoadReturn.apply(this, arguments);
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 512);
if (this.get('propagateDown')) {
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 513);
var selected = this.get(SELECTED);
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 514);
this.forSomeChildren(function(node) {
					_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 4)", 514);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 515);
node.set(SELECTED , selected, 'propagatingDown');
				});
			}
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 518);
this._root._visibleSequence = null;

		},
		/**
		 * When propagating selection up, it is called by a child when changing its selected state
		 * so that the parent adjusts its own state accordingly.
		 * @method _childSelectedChange
		 * @private
		 */
		_childSelectedChange: function () {
			_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_childSelectedChange", 527);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 528);
var count = 0, selCount = 0, value;
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 529);
this.forSomeChildren(function (node) {
				_yuitest_coverfunc("build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 5)", 529);
_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 530);
count +=2;
				_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 531);
selCount += node.get(SELECTED);
			});
            // While this is not solved:  http://yuilibrary.com/projects/yui3/ticket/2532810
            // This is the good line:
			//this.set(SELECTED, (selCount === 0?NOT_SELECTED:(selCount === count?FULLY_SELECTED:PARTIALLY_SELECTED)), {src:'propagatingUp'});
            // This is the patch:
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 537);
value = (selCount === 0?NOT_SELECTED:(selCount === count?FULLY_SELECTED:PARTIALLY_SELECTED));
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 538);
this._afterSelectedChange({
                prevVal: this._iNode.selected,
                newVal: value,
                src: 'propagatingUp'
            });
            _yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 543);
this._iNode.selected = value;
            // end of the patch
			_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 545);
return this;
		}

	},
	{
		/**
		 * Outer template to produce the markup for a node in the tree.
         * It replaces the standard one provided by FlyweightTreeNode.
         * Adds the proper ARIA role and node selection.
		 * @property OUTER_TEMPLATE
		 * @type String
		 * @static
		 */
		OUTER_TEMPLATE: '<li id="{id}" class="{CNAME_NODE} {CNAME_SEL_PREFIX}-{selected}" ' +
                'role="treeitem" aria-expanded="{expanded}" aria-checked="{_aria_checked}">' +
            '{INNER_TEMPLATE}' +
            '<ul class="{CNAME_CHILDREN}" role="group">{children}</ul></li>',
		/**
		 * Template to produce the markup for a node in the tree.
         * It replaces the standard one provided by FlyweightTreeNode.
         * Adds places for the toggle and selection icons, an extra app-dependent icon and the label.
		 * @property INNER_TEMPLATE
		 * @type String
         *
		 * @static
		 */
		INNER_TEMPLATE: '<div tabIndex="{tabIndex}" class="{CNAME_CONTENT}"><div class="{CNAME_TOGGLE}"></div>' +
            '<div class="{CNAME_ICON}"></div><div class="{CNAME_SELECTION}"></div><div class="{CNAME_LABEL}">{label}</div></div>',
        /**
         * Collection of classNames to set in the template.
         * @property CNAMES
         * @type Object
         * @static
         * @final
         */
        CNAMES: {
            CNAME_TOGGLE: cName('toggle'),
            CNAME_ICON: cName('icon'),
            CNAME_SELECTION: cName('selection'),
            CNAME_SEL_PREFIX: cName('selected-state'),
            CNAME_LABEL: cName('label')
        },
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
			 * `selected` can return
			 *
			 * - Y.FWTreeNode.NOT\_SELECTED (0) not selected
			 * - Y.FWTreeNode.PARTIALLY\_SELECTED (1) partially selected: some children are selected, some not or partially selected.
			 * - Y.FWTreeNode.FULLY\_SELECTED (2) fully selected.
             * - null when {{#crossLing "selectionEnabled:attribute"}}{{/crossLink}} is not enabled
             *
             * `selected`can be set to:
             *
             * - any true value:  will produce a FULLY\_SELECTED state.
             * - any false value: will produce a NOT\_SELECTED state.
			 *
			 * The partially selected state can only be the result of selection propagating up from a child node.
			 * Since PARTIALLY\_SELECTED cannot be set, leaving just two possible values for setting,
             * any true or false value will be valid when setting.  However, no matter what values were
             * used when setting, one of the three possible values above will be returned.
             *
			 * @attribute selected
			 * @type Integer
			 * @default NOT_SELECTED
			 */
			selected: {
				value:NOT_SELECTED,
                setter: '_selectedSetter',
                getter: '_selectedGetter'
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
             * Enables node selection. Nodes with selection enabled w
             * @attribute selectEnabled
             * @type Boolean
             * @default true
             */
            selectionEnabled: {
                value: true,
                validator: Lang.isBoolean
            },
			/**
			 * Whether selection of one node should propagate to its parent.
             * See {{#crossLink "selected:attribute"}}{{/crossLink}}.
			 * @attribute propagateUp
			 * @type Boolean
			 * @default true
			 */
			propagateUp: {
				value: true,
				validator: Lang.isBoolean,
                getter: '_propagageGetter'
			},
			/**
			 * Whether selection of one node should propagate to its children.
             * See {{#crossLink "selected:attribute"}}{{/crossLink}}.
             * @attribute propagateDown
			 * @type Boolean
			 * @default true
			 */
			propagateDown: {
				value: true,
				validator: Lang.isBoolean,
                getter: '_propagageGetter'
			}
		}
	}
);

/**
 * Fires when the space bar is pressed.
 * Used internally to toggle node selection.
 * @event spacebar
 * @param ev {EventFacade} YUI event facade for keyboard events, including:
 * @param ev.domEvent {Object} The original event produced by the DOM, except:
 * @param ev.domEvent.target {Node} The DOM element that had the focus when the key was pressed
 * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed
 */
/**
 * Fires when the enter key is pressed.
 * @event enterkey
 * @param ev {EventFacade} YUI event facade for keyboard events, including:
 * @param ev.domEvent {Object} The original event produced by the DOM, except:
 * @param ev.domEvent.target {Node} The DOM element that had the focus when the key was pressed
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

_yuitest_coverline("build/gallery-fwt-treeview/gallery-fwt-treeview.js", 730);
Y.FWTreeNode = FWTN;

}, '@VERSION@', {"requires": ["gallery-flyweight-tree", "widget", "base-build"], "skinnable": true});
