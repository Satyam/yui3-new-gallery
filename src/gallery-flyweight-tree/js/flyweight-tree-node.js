

/**
* An implementation of the flyweight pattern.  This class should not be instantiated directly.
* Instances of this class can be requested from the flyweight manager class
*
* The FlyweightTreeManager will create instances of this class as required and
* pool them when not in use.
* The instances can be slid on top of the nodes (iNodes, for internal nodes)
* in literal object containing the definition
* of a tree and will take its state from the `iNode` it is slid upon.
* It relies for most of its functionality on the flyweight manager object,
* which contains most of the code.
* @class FlyweightTreeNode
* @extends Base
* @constructor  Do not instantiate directly.
*/
FWNode = Y.Base.create(
	FWNODE_NAME,
	Y.Base,
	[],
	{
		/**
		 * Reference to the iNode in the configuration tree it has been slid over.
		 * @property _iNode
		 * @type {Object}
		 * @private
		 **/
		_iNode:null,
		/**
		 * Reference to the FlyweightTreeManager instance this node belongs to.
		 * It is set by the root and should be considered read-only.
		 * @property _root
		 * @type FlyweightTreeManager
		 * @private
		 */
		_root: null,
        /**
         * Standard lifecycle method, reads the root node from the config
         * @method initializer
         * @param cfg {object} configuration data
         * @protected
         */
        initializer: function (cfg) {
            this._root = cfg.root;
            this.after('expandedChange', this._afterExpandedChange);
            this.after('labelChange', this._afterLabelChange);
        },
        /**
         * Patch to work around the issue with the static _buildCfg property of Base
         * that doesn't quite work.
         * @method _buildCfgPatch
         * @private
         */
        _buildCfgPatch: function () {
            var t = null, constr = this.constructor;
            if (!constr._buildConfigPatched) {
                constr._buildConfigPatched = true;
                Y.mix(constr.CNAMES, constr.superclass.constructor.CNAMES);
                while (!t) {
                    t = constr.OUTER_TEMPLATE;
                    constr = constr.superclass.constructor;
                }
                constr = this.constructor;
                constr.OUTER_TEMPLATE = t;
                t = null;
                while (!t) {
                    t = constr.INNER_TEMPLATE;
                    constr = constr.superclass.constructor;
                }
                constr = this.constructor;
                constr.INNER_TEMPLATE = t;
            }

        },
		/**
		 * Returns a string with the markup for this node along that of its children
		 * produced from its attributes rendered
		 * via the first template string it finds in these locations:
		 *
		 * * It's own {{#crossLink "template"}}{{/crossLink}} configuration attribute
		 * * The static {{#crossLink "FlyweightTreeNode/TEMPLATE"}}{{/crossLink}} class property
		 *
		 * @method _getHTML
		 * @param index {Integer} index of this node within the array of siblings
		 * @param nSiblings {Integer} number of siblings including this node
		 * @param depth {Integer} number of levels to the root
		 * @return {String} markup generated by this node
		 * @protected
		 */
		_getHTML: function(index, nSiblings, depth) {
			// assumes that if you asked for the HTML it is because you are rendering it
			var root = this._root,
                iNode = this._iNode,
				attrs = this.getAttrs(),
				s = '',
				childCount = iNode.children && iNode.children.length,
                CNAMES = this.constructor.CNAMES,
				nodeClasses = [CNAMES.CNAME_NODE],
				templ,
                it = iNode.inner_template || this.constructor.INNER_TEMPLATE,
                ot = iNode.outer_template || this.constructor.OUTER_TEMPLATE;

            templ = ot.replace('{INNER_TEMPLATE}', it);
            Y.mix(attrs, CNAMES);
			iNode._rendered = true;
			if (childCount) {
				if (attrs.expanded) {
					iNode._childrenRendered = true;
					this.forSomeChildren( function (fwNode, index, array) {
						s += fwNode._getHTML(index, array.length, depth + 1);
					});
					nodeClasses.push(CNAMES.CNAME_EXPANDED);
				} else {
					nodeClasses.push(CNAMES.CNAME_COLLAPSED);
				}
			} else {
				if (this._root.get(DYNAMIC_LOADER) && !iNode.isLeaf) {
					nodeClasses.push(CNAMES.CNAME_COLLAPSED);
				} else {
					nodeClasses.push(CNAMES.CNAME_NOCHILDREN);
				}
			}
			if (index === 0) {
				nodeClasses.push(CNAMES.CNAME_FIRSTCHILD);
			}
			if (index === nSiblings - 1) {
				nodeClasses.push(CNAMES.CNAME_LASTCHILD);
			}
            nodeClasses.push(CNAMES.CNAME_TYPE_PREFIX + (iNode.type || 'default'));
			attrs.children = s;
			attrs.CNAME_NODE = nodeClasses.join(' ');
            attrs.tabIndex = (iNode === root._focusedINode)?0:-1;

			return Lang.sub(templ, attrs);

		},
		/**
		 * Method to slide this instance on top of another iNode in the configuration object
		 * @method _slideTo
		 * @param iNode {Object} iNode in the underlying configuration tree to slide this object on top of.
		 * @private
		 */
		_slideTo: function (iNode) {
			this._iNode = iNode;
			this._stateProxy = iNode;
		},
        /**
         * Whether this node has children.
         * If there are children, it actually returns the number of children,
         * otherwise it might return 0 or undefined.
         * @method hasChildren
         * @return {Boolean} true if the node has children
         */
        hasChildren: function () {
            var children = this._iNode.children;
            return !!(children && children.length);
        },
		/**
		 * Executes the given function on each of the child nodes of this node.
		 * @method forSomeChildren
		 * @param fn {Function} Function to be executed on each node
		 *		@param fn.child {FlyweightTreeNode} Instance of a suitable subclass of FlyweightTreeNode,
		 *		positioned on top of the child node
		 *		@param fn.index {Integer} Index of this child within the array of children
		 * @param scope {object} The falue of this for the function.  Defaults to the parent.
		**/
		forSomeChildren: function(fn, scope) {
			var root = this._root,
				children = this._iNode.children,
				child, ret;
			scope = scope || this;
			if (children && children.length) {
				YArray.some(children, function (iNode, index, array) {
					child = root._poolFetch(iNode);
					ret = fn.call(scope, child, index, array);
					root._poolReturn(child);
					return ret;
				});
			}
		},
		/**
		 * Responds to the change in the {{#crossLink "label:attribute"}}{{/crossLink}} attribute.
		 * @method _afterLabelChange
		 * @param ev {EventFacade} standard attribute change event facade
		 * @private
		 */
        _afterLabelChange: function (ev) {
            var el = Y.one('#' + this._iNode.id + ' .' + FWNode.CNAMES.CNAME_CONTENT);
            if (el) {
                el.setHTML(ev.newVal);
            }
        },
		/**
		 * Getter for the expanded configuration attribute.
		 * It is meant to be overriden by the developer.
		 * The supplied version defaults to true if the expanded property
		 * is not set in the underlying configuration tree.
		 * It can be overriden to default to false.
		 * @method _expandedGetter
		 * @return {Boolean} The expanded state of the node.
		 * @protected
		 */
		_expandedGetter: function () {
			return this._iNode.expanded !== false;
		},
		/**
		 * Responds to the change in the {{#crossLink "expanded:attribute"}}{{/crossLink}} attribute.
		 * It renders the child nodes if this branch has never been expanded.
		 * Then sets the className on the node to the static constants
		 * CNAME\_COLLAPSED or CNAME\_EXPANDED from Y.FlyweightTreeManager
		 * @method _afterExpandedChange
		 * @param ev {EventFacade} standard attribute change event facade
		 * @private
		 */
		_afterExpandedChange: function (ev) {
			var value = !!ev.newVal,
                self = this,
				iNode = self._iNode,
				root = self._root,
				el = Y.one('#' + iNode.id),
				dynLoader = root.get(DYNAMIC_LOADER),
                CEXP = FWNode.CNAMES.CNAME_EXPANDED,
                CCOLL = FWNode.CNAMES.CNAME_COLLAPSED;

			iNode.expanded = value;
			if (dynLoader && !iNode.isLeaf && (!iNode.children  || !iNode.children.length)) {
				this._loadDynamic();
				return;
			}
			if (el) {
                if (iNode.children && iNode.children.length) {
                    if (value) {
                        if (!iNode._childrenRendered) {
                            self._renderChildren();
                        }
                        el.replaceClass(CCOLL, CEXP);
                    } else {
                        el.replaceClass(CEXP, CCOLL);
                    }
                }
                el.set('aria-expanded', String(value));
            }
		},
		/**
		 * Triggers the dynamic loading of children for this node.
		 * @method _loadDynamic
		 * @private
		 */
		_loadDynamic: function () {
			var self = this,
				root = self._root;
			Y.one('#' + this.get('id')).replaceClass(FWNode.CNAMES.CNAME_COLLAPSED, FWNode.CNAMES.CNAME_LOADING);
			root.get(DYNAMIC_LOADER).call(root, self, Y.bind(self._dynamicLoadReturn, self));

		},
		/**
		 * Callback for the dynamicLoader method.
		 * @method _dynamicLoadReturn
		 * @param response {Array} array of child iNodes
		 * @private
		 */
		_dynamicLoadReturn: function (response) {
			var self = this,
				iNode = self._iNode,
				root = self._root,
                CNAMES = FWNode.CNAMES;

			if (response) {

				iNode.children = response;
				root._initNodes(iNode);
				self._renderChildren();
			} else {
				iNode.isLeaf = true;
			}
			// isLeaf might have been set in the response, not just in the line above.
			Y.one('#' + iNode.id).replaceClass(CNAMES.CNAME_LOADING, (iNode.isLeaf?CNAMES.CNAME_NOCHILDREN:CNAMES.CNAME_EXPANDED));
		},
		/**
		 * Renders the children of this node.
		 * It the children had been rendered, they will be replaced.
		 * @method _renderChildren
         * @param el {Node} Container to render the children into.
         * Used only for rendering of the root when it will be the contentBox.
		 * @private
		 */
		_renderChildren: function (el) {
			var s = '',
				iNode = this._iNode,
                depth = this.get('depth');
			iNode._childrenRendered = true;
			this.forSomeChildren(function (fwNode, index, array) {
				s += fwNode._getHTML(index, array.length, depth + 1);
			});
            el = el || Y.one('#' + iNode.id + ' .' + FWNode.CNAMES.CNAME_CHILDREN);
            el.setHTML(s);
		},
		/**
		 * Prevents this instance from being returned to the pool and reused.
		 * Remember to {{#crossLink "release"}}{{/crossLink}} this instance when no longer needed.
		 * @method hold
		 * @chainable
		 */
		hold: function () {
			return (this._iNode._held = this);
		},
		/**
		 * Allows this instance to be returned to the pool and reused.
		 *
		 * __Important__: This instance should not be used after being released
		 * @method release
		 * @chainable
		 */
		release: function () {
			this._iNode._held = null;
			this._root._poolReturn(this);
			return this;
		},
		/**
		 * Returns the parent node for this node or null if none exists.
		 * The copy is on {{#crossLink "hold"}}{{/crossLink}}.
		 * Remember to {{#crossLink "release"}}{{/crossLink}} the copy to the pool when done.
		 * @method getParent
		 * @return FlyweightTreeNode
		 */
		getParent: function() {
			var iNode = this._iNode._parent;
			return (iNode?this._root._poolFetch(iNode).hold():null);
		},
		/**
		 * Returns the next sibling node for this node or null if none exists.
		 * The copy is on {{#crossLink "hold"}}{{/crossLink}}.
		 * Remember to {{#crossLink "release"}}{{/crossLink}} the copy to the pool when done.
		 * @method getNextSibling
		 * @return FlyweightTreeNode
		 */
		getNextSibling: function() {
			var parent = this._iNode._parent,
				siblings = (parent && parent.children) || [],
				index = siblings.indexOf(this._iNode) + 1;
			if (index === 0 || index >= siblings.length) {
				return null;
			}
			return this._root._poolFetch(siblings[index]).hold();
		},
		/**
		 * Returns the previous sibling node for this node or null if none exists.
		 * The copy is on {{#crossLink "hold"}}{{/crossLink}}.
		 * Remember to {{#crossLink "release"}}{{/crossLink}} the copy to the pool when done.
		 * @method getPreviousSibling
		 * @return FlyweightTreeNode
		 */
		getPreviousSibling: function() {
			var parent = this._iNode._parent,
				siblings = (parent && parent.children) || [],
				index = siblings.indexOf(this._iNode) - 1;
			if (index < 0) {
				return null;
			}
			return this._root._poolFetch(siblings[index]).hold();
		},
        /**
         * Sets the focus to this node.
         * @method focus
         * @chainable
         */
        focus: function() {
            return this._root.set(FOCUSED, this);
        },
        /**
         * Removes the focus from this node
         * @method blur
         * @chainable
         */
        blur: function () {
            return this._root.set(FOCUSED, null);
        },
		/**
		 * Sugar method to toggle the expanded state of the node.
		 * @method toggle
		 * @chainable
		 */
		toggle: function() {
			return this.set(EXPANDED, !this.get(EXPANDED));
		},
        /**
         * Sugar method to expand a node
         * @method expand
         * @chainable
         */
        expand: function() {
            return this.set(EXPANDED, true);
        },
        /**
         * Sugar method to collapse this node
         * @method collapse
         * @chainable
         */
        collapse: function() {
            return this.set(EXPANDED, false);
        },
		/**
		 * Returns true if this node is the root node
		 * @method isRoot
		 * @return {Boolean} true if root node
		 */
		isRoot: function() {
			return this._root._tree === this._iNode;
		},
		/**
		* Gets the stored value for the attribute, from either the
		* internal state object, or the state proxy if it exits
		*
		* @method _getStateVal
		* @private
		* @param {String} name The name of the attribute
		* @return {Any} The stored value of the attribute
		*/
		_getStateVal : function(name) {
			var iNode = this._iNode;
			if (this._state.get(name, BYPASS_PROXY) || !iNode) {
				return this._state.get(name, VALUE);
			}
			if (iNode.hasOwnProperty(name)) {
				return iNode[name];
			}
			return this._state.get(name, VALUE);
		},

		/**
		* Sets the stored value for the attribute, in either the
		* internal state object, or the state proxy if it exits
		*
		* @method _setStateVal
		* @private
		* @param {String} name The name of the attribute
		* @param {Any} value The value of the attribute
		*/
		_setStateVal : function(name, value) {
			var iNode = this._iNode;
			if (this._state.get(name, BYPASS_PROXY) || this._state.get(name, 'initializing') || !iNode) {
				this._state.add(name, VALUE, value);
			} else {
				iNode[name] = value;
			}
		}
	},
	{
		/**
		 * Outer template string to be used to render this node.
		 * It may be overriden by the subclass.
		 *
		 * It contains the HTML markup for the wrapper for the node plus placeholders,
		 * enclosed in curly braces, that have access to any of the
		 * configuration attributes of this node plus several predefined placeholders.
         *
         * It must contain at least three elements identified by their CSS classNames
         * and a special placeholder:

         +----------------------------+
         | {CNAME_NODE}               |
         | +------------------------+ |
         | | {INNER_TEMPLATE}        | |
         | +------------------------+ |
         |                            |
         | +------------------------+ |
         | | {CNAME_CHILDREN}       | |
         | +------------------------+ |
         +----------------------------+

         * For example:

        OUTER_TEMPLATE:'<div id="{id}" class="{CNAME_NODE}" role="" aria-expanded="{expanded}">{INNER_TEMPLATE}' +
                            '<div class="{CNAME_CHILDREN}" role="group">{children}</div></div>',

         * The outermost container identified by the className `{CNAME_NODE}`
         * must also use the `{id}` placeholder to set the `id` of the node.
         * It should also have the proper ARIA role assigned and the
         * `aria-expanded` set to the `{expanded}` placeholder.
         *
         * It must contain two further elements:
         *
         * * A placeholder for the INNER_TEMPLATE of this node, identified by the placeholder
         *   `{INNER_TEMPLATE}` which should contain everything the user would associate
         *   with this node, such as the label and other status indicators
         *   such as toggle and selection indicators.
         *
         * * The other element is the container for the children of this node.
         *   It will be identified by the className `{CNAME_CHILDREN}` and it
         *   should enclose the placeholder `{children}`.
         *
		 * @property OUTER_TEMPLATE
		 * @type {String}
		 * @default '<div id="{id}" class="{CNAME_NODE}" role="" aria-expanded="{expanded}"><div tabIndex="{tabIndex}"
         class="{CNAME_CONTENT}">{label}</div><div class="{CNAME_CHILDREN}" role="group">{children}</div></div>'
		 * @static
		 */
        OUTER_TEMPLATE:'<div id="{id}" class="{CNAME_NODE}" role="" aria-expanded="{expanded}">{INNER_TEMPLATE}' +
                            '<div class="{CNAME_CHILDREN}" role="group">{children}</div></div>',
        /**
         * The template for what the user will see of the node.
         * It has been broken appart from the outer template because
         * this is the part that the developer is most likely to modify
         * so that there is no need to repeat the outer envelope over and over again.
         * For example:
         *
            INNER_TEMPLATE:'<div tabIndex="{tabIndex}" class="{CNAME_CONTENT}">{label}</div>',

         * This element must have at least a palceholder for the `{label}` attribute
         * and any other visual clues to the user.  It must also have the CSS className
         * `{CNAME_CONTENT}` which will be replaced by a suitable name at execution
         * and that will help to locate the contents of this node.
         *
         * This is the element that would receive the focus of the node, thus,
         * it must have a `{tabIndex}` placeholder to receive the appropriate
         * value for the `tabIndex` attribute.
		 * @property INNER_TEMPLATE
		 * @type {String}
		 * @default '<div tabIndex="{tabIndex}" class="{CNAME_CONTENT}">{label}</div>'
		 * @static
         */
        INNER_TEMPLATE:'<div tabIndex="{tabIndex}" class="{CNAME_CONTENT}">{label}</div>',
        /**
         * Collection of CSS class names used in the template.
         * It is written all uppercase because its contents are meant to be constants,
         * this object itself being augmented by class names added by its subclasses
         * @attribute CNAMES
         * @type Object
         * @static
         */
        CNAMES: {
            CNAME_NODE: getCName(FWNODE_NAME),
            CNAME_CONTENT: cName('content'),
            CNAME_CHILDREN: cName('children'),
            CNAME_COLLAPSED: cName('collapsed'),
            CNAME_EXPANDED: cName(EXPANDED),
            CNAME_NOCHILDREN: cName('no-children'),
            CNAME_FIRSTCHILD: cName('first-child'),
            CNAME_LASTCHILD: cName('last-child'),
            CNAME_LOADING: cName('loading'),
            CNAME_TYPE_PREFIX: cName('type-')
/*        },
        _buildCfg: {
            // aggregates: ['CNAMES']

 */       },
		ATTRS: {
			/**
			 * Reference to the FlyweightTreeManager this node belongs to
			 * @attribute root
			 * @type {FlyweightTreeManager}
			 * @readOnly
			 *
			 */

			root: {
				_bypassProxy: true,
				readOnly: true,
				getter: function() {
					return this._root;
				}
			},

			/**
			 * Template to use on this particular instance.
			 * The renderer will default to the static TEMPLATE property of this class
			 * (the preferred way) or the nodeTemplate configuration attribute of the root.
			 * See the TEMPLATE static property.
			 * @attribute template
			 * @type {String}
			 * @default undefined
			 */
			template: {
				validator: Lang.isString
			},
			/**
			 * Label for this node. Nodes usually have some textual content, this is the place for it.
			 * @attribute label
			 * @type {String}
			 * @default ''
			 */
			label: {
				setter:String,
				value: ''
			},
			/**
			 * Id to assign to the DOM element that contains this node.
             * Once rendered, it cannot be changed.
			 * If none was supplied, it will generate one.
			 * @attribute id
			 * @type {Identifier}
			 * @default guid()
			 */
			id: {
				validator: function () {
                    return !this.get('rendered');
                }
			},
			/**
			 * Returns the depth of this node from the root.
			 * This is calculated on-the-fly.
			 * @attribute depth
			 * @type Integer
			 * @readOnly
			 */
			depth: {
				_bypassProxy: true,
				readOnly: true,
				getter: function () {
					var count = 0,
						iNode = this._iNode;
					while (iNode._parent) {
						count += 1;
						iNode = iNode._parent;
					}
					return count-1;
				}
			},
			/**
			 * Expanded state of this node.
			 * @attribute expanded
			 * @type Boolean
			 * @default true
			 */
			expanded: {
				getter: '_expandedGetter'
			}
		}
	}
);
Y.FlyweightTreeNode = FWNode;

