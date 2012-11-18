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
Y.FWTreeView = FWTV;