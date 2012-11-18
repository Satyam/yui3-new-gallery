YUI.add('gallery-fwt-treeview', function (Y, NAME) {

'use strict';
/*jslint white: true */
var Lang = Y.Lang,
	YArray = Y.Array,
    FWTV,
	getCName = Y.ClassNameManager.getClassName,
	cName = function (name) {
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
			this._domEvents = ['click'];
			this._loadConfig(config.tree);
		},
		/**
		 * Widget lifecyle method.
         * Adds the `tree` role to the content box.
		 * @method renderUI
		 * @protected
		 */
		renderUI: function () {
            FWTV.superclass.renderUI.apply(this, arguments);
            this.get(CBX).set('role','tree');
		},
		/**
		 * Widget lifecyle method.
         * Sets the keydown listener to handle keyboard navigation.
		 * @method bindUI
		 * @protected
		 */
        bindUI: function () {
            FWTV.superclass.bindUI.apply(this, arguments);
            this._eventHandles.push(this.get(CBX).on('keydown', this._onKeyDown, this));
        },
        /**
         * Listener for keyboard events to handle keyboard navigation
         * @method _onKeyDown
         * @param ev {EventFacade} Standard YUI key facade
         * @private
         */
        _onKeyDown: function (ev) {
            var ch = ev.charCode,
                iNode = this._focusedINode,
                seq = this._visibleSequence,
                index = this._visibleIndex,
                fwNode;

            switch (ch) {
                case 38: // up
                    if (!seq) {
                        seq = this._rebuildSequence();
                        index = seq.indexOf(iNode);
                    }
                    index -=1;
                    if (index >= 0) {
                        iNode = seq[index];
                        this._visibleIndex = index;
                    } else {
                        iNode = null;
                    }
                    break;
                case 39: // right
                    if (iNode.expanded) {
                        if (iNode.children && iNode.children.length) {
                            iNode = iNode.children[0];
                        } else {
                            iNode = null;
                        }
                    } else {
                        this._poolReturn(this._poolFetch(iNode).set(EXPANDED, true));
                        iNode = null;
                    }

                    break;
                case 40: // down
                    if (!seq) {
                        seq = this._rebuildSequence();
                        index = seq.indexOf(iNode);
                    }
                    index +=1;
                    if (index < seq.length) {
                        iNode = seq[index];
                        this._visibleIndex = index;
                    } else {
                        iNode = null;
                    }
                    break;
                case 37: // left
                    if (iNode.expanded && iNode.children) {
                        this._poolReturn(this._poolFetch(iNode).set(EXPANDED, false));
                        iNode = null;
                    } else {
                        iNode = iNode._parent;
                        if (iNode === this._tree) {
                            iNode = null;
                        }
                    }

                    break;
                case 36: // home
                    iNode = this._tree.children && this._tree.children[0];
                    break;
                case 35: // end
                    index = this._tree.children && this._tree.children.length;
                    if (index) {
                        iNode = this._tree.children[index -1];
                    } else {
                        iNode = null;
                    }
                    break;
                case 13: // enter
                    fwNode = this._poolFetch(iNode);
                    this.fire('enterkey', {
                        domEvent:ev,
                        node: fwNode
                    });
                    fwNode.fire('enterkey', {
                        domEvent:ev,
                        node: fwNode
                    });
                    this._poolReturn(fwNode);
                    iNode = null;
                    break;
                case 32: // spacebar
                    fwNode = this._poolFetch(iNode);
                    this.fire('spacebar', {
                        domEvent:ev,
                        node: fwNode
                    });
                    fwNode.fire('spacebar', {
                        domEvent:ev,
                        node: fwNode
                    });
                    this._poolReturn(fwNode);
                    iNode = null;
                    break;
                case 106: // asterisk on the numeric keypad
                    this.expandAll();
                    break;
                default: // initial
                    iNode = null;
                    break;
            }
            if (iNode) {
                this._focusOnINode(iNode);
                ev.halt();
                return false;
            }
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
            var iNode = this._findINodeByElement(ev.domEvent.target);
            this._focusOnINode(iNode);
            if (this._visibleSequence) {
                this._visibleIndex = this._visibleSequence.indexOf(iNode);
            }
        },
        /**
         * Rebuilds the array of {{#crossLink "_visibleSequence"}}{{/crossLink}} that can be traversed with the up/down arrow keys
         * @method _rebuildSequence
         * @private
         */
        _rebuildSequence: function () {
            var seq = [],
                loop = function(iNode) {
                    YArray.each(iNode.children || [], function(childINode) {
                        seq.push(childINode);
                        if (childINode.expanded) {
                            loop(childINode);
                        }
                    });
                };
            loop(this._tree);
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
 Y.FWTreeNode = Y.Base.create(
	'fw-treenode',
	Y.FlyweightTreeNode,
	[],
	{
		initializer: function() {
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
            this._root._visibleSequence = null;
        },
		/**
		 * Responds to the click event by toggling the node
		 * @method _afterClick
		 * @param ev {EventFacade}
		 * @private
		 */
		_afterClick: function (ev) {
			var target = ev.domEvent.target;
			if (target.hasClass(CNAMES.cname_toggle)) {
				this.toggle();
			} else if (target.hasClass(CNAMES.cname_selection)) {
				this.toggleSelection();
			} else if (target.hasClass(CNAMES.cname_content) || target.hasClass(CNAMES.cname_icon)) {
				if (this.get('root').get('toggleOnLabelClick')) {
					this.toggle();
				}
			}
		},
		/**
		 * Sugar method to toggle the selected state of a node.
         * See {{#crossLink "selected:attribute"}}{{/crossLink}}.
		 * @method toggleSelection
		 */
		toggleSelection: function() {
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
			var selected = ev.newVal,
                prefix = CNAMES.cname_sel_prefix + '-',
                el;

			if (!this.isRoot()) {
				el = Y.one('#' + this.get('id'));
                el.replaceClass(prefix + ev.prevVal, prefix + selected);
                el.set('aria-checked', this._ariaCheckedGetter());
				if (this.get('propagateUp') && ev.src !== 'propagatingDown') {
					this.getParent()._childSelectedChange().release();
				}
			}
			if (this.get('propagateDown') && ev.src !== 'propagatingUp') {
				this.forSomeChildren(function(node) {
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
            return ['false','mixed','true'][this.get(SELECTED)];
        },
		/**
		 * Overrides the original in FlyweightTreeNode so as to propagate the selected state
		 * on dynamically loaded nodes.
		 * @method _dynamicLoadReturn
		 * @private
		 */
		_dynamicLoadReturn: function () {
            Y.FWTreeNode.superclass._dynamicLoadReturn.apply(this, arguments);
			if (this.get('propagateDown')) {
				var selected = this.get(SELECTED);
				this.forSomeChildren(function(node) {
					node.set(SELECTED , selected, 'propagatingDown');
				});
			}
            this._root._visibleSequence = null;

		},
		/**
		 * When propagating selection up, it is called by a child when changing its selected state
		 * so that the parent adjusts its own state accordingly.
		 * @method _childSelectedChange
		 * @private
		 */
		_childSelectedChange: function () {
			var count = 0, selCount = 0;
			this.forSomeChildren(function (node) {
				count +=2;
				selCount += node.get(SELECTED);
			});
			this.set(SELECTED, (selCount === 0?NOT_SELECTED:(selCount === count?FULLY_SELECTED:PARTIALLY_SELECTED)), {src:'propagatingUp'});
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
