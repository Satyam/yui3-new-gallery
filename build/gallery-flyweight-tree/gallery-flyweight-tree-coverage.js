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
_yuitest_coverage["build/gallery-flyweight-tree/gallery-flyweight-tree.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-flyweight-tree/gallery-flyweight-tree.js",
    code: []
};
_yuitest_coverage["build/gallery-flyweight-tree/gallery-flyweight-tree.js"].code=["YUI.add('gallery-flyweight-tree', function (Y, NAME) {","","'use strict';","/*jslint white: true */","var Lang = Y.Lang,","	YArray = Y.Array,","","    DOT = '.',","	BYPASS_PROXY = \"_bypassProxy\",","	CBX = 'contentBox',","	VALUE = 'value',","    EXPANDED = 'expanded',","    DYNAMIC_LOADER = 'dynamicLoader',","    TABINDEX = 'tabIndex',","    FOCUSED = 'focused',","","    DEFAULT_POOL = '_default',","","    getCName = Y.ClassNameManager.getClassName,","    FWNODE_NAME = 'flyweight-tree-node',","	CNAME_NODE = getCName(FWNODE_NAME),","	cName = function (name) {","		return getCName(FWNODE_NAME, name);","	},","    CNAME_CONTENT = cName('content'),","	CNAME_CHILDREN = cName('children'),","	CNAME_COLLAPSED = cName('collapsed'),","	CNAME_EXPANDED = cName(EXPANDED),","	CNAME_NOCHILDREN = cName('no-children'),","	CNAME_FIRSTCHILD = cName('first-child'),","	CNAME_LASTCHILD = cName('last-child'),","	CNAME_LOADING = cName('loading'),","","	FWMgr,","	FWNode;","","/**","* @module gallery-flyweight-tree","*","*/","","/**"," * Widget to handle its child nodes by using the flyweight pattern."," *"," * The information for the tree is stored internally in a plain object without methods,"," * events or attributes."," * This manager will position FlyweightTreeNode instances (or subclasses of it)"," * over these iNodes from a small pool of them, in order to save memory."," *"," * The nodes on this configuration tree are referred to in this documentation as `iNodes`"," * for 'internal nodes', to tell them apart from the pooled FlyweightTreeNode instances"," * that will be used to manipulate them.  The FlyweightTreeNode instances will usually"," * be declared as `fwNodes` when confusion might arise."," * If a variable or argument is not explicitly named `iNode` or a related name it is"," * FlyweightTreeNode instance."," *"," * The developer should not be concerned about the iNodes,"," * except in the initial configuration tree."," * If the developer finds anything that needs to be done through iNodes,"," * it is a bug and should be reported (thanks)."," * iNodes should be private."," *"," * @class FlyweightTreeManager"," * @extends Widget"," * @constructor"," */","","FWMgr = Y.Base.create(","    NAME,","    Y.Widget,","    [],","    {","        /**","         * Clone of the configuration tree.","         * The FlyweightTreeNode instances will use the iNodes (internal nodes) in this tree as the storage for their state.","         * @property _tree","         * @type Object","         * @private","         */","        _tree: null,","        /**","         * Pool of FlyweightTreeNode instances to use and reuse by the manager.","         * It contains a hash of arrays indexed by the iNode (internal node) type.","         * Each array contains a series of FlyweightTreeNode subclasses of the corresponding type.","         * @property _pool","         * @type {Object}","         * @private","         */","        _pool: null,","        /**","         * List of dom events to be listened for at the outer container and fired again","         * at the FlyweightTreeNode level once positioned over the source iNode.","         *","         * Since the node instances are not actually there, they can't listen to the events themselves","         * so the events listed here will serve to wake up those instances and get the event","         * as if they had been there all along.","         * @property _domEvents","         * @type Array of strings","         * @protected","         * @default null","         */","        _domEvents: null,","        /**","         * Reference to the element that has the focus or should have the focus","         * when this widget is active (ie, tabbed into).","         * Mostly used for WAI-ARIA support.","         * @property _focusedINode","         * @type FlyweightTreeNode","         * @private","         * @default null","         */","        _focusedINode: null,","","        /**","         * Event handles of events subscribed to, to detach them on destroy","         * @property _eventHandles","         * @type Array of EventHandles","         * @private","         */","        _eventHandles: null,","","        /**","         * Part of the Widget lifecycle.","         * @method initializer","         * @protected","         */","        initializer:function () {","            this._pool = {};","            this._eventHandles = [];","        },","        /**","         * Part of the lifecycle.  Destroys the pools.","         * @method destructor","         * @protected","         */","        destructor: function () {","            YArray.each(this._pool, function (fwNode) {","                fwNode.destroy();","            });","            this._pool = null;","            YArray.each(this._eventHandles, function (evHandle) {","                evHandle.detach();","            });","            this._eventHandles = null;","","        },","        /**","         * Method to load the configuration tree.","         * The nodes in this tree are copied into iNodes (internal nodes) for internal use.","         *","         * The initializer does not load the tree automatically so as to allow the subclass","         * of this manager","         * to process the tree definition anyway it wants, adding defaults and such","         * and to name the tree whatever is suitable.","         * For TreeView, the configuration property is named `tree`, for a form, it is named `form`.","         * It also sets initial values for some default properties such as `parent` references and `id` for all iNodes.","         * @method _loadConfig","         * @param tree {Array} Configuration for the first level of nodes.","         * Contains objects with the following attributes:","         * @param tree.label {String} Text or HTML markup to be shown in the node","         * @param [tree.expanded=true] {Boolean} Whether the children of this node should be visible.","         * @param [tree.children] {Array} Further definitions for the children of this node","         * @param [tree.type=FWTreeNode] {FWTreeNode | String} Class used to create instances for this iNode.","         * It can be a reference to an object or a name that can be resolved as `Y[name]`.","         * @param [tree.id=Y.guid()] {String} Identifier to assign to the DOM element containing the UI for this node.","         * @param [tree.template] {String} Template for this particular node.","         * @protected","         */","        _loadConfig: function (tree) {","            this._tree = {","                children: Y.clone(tree)","            };","            this._initNodes(this._tree);","","        },","        /** Initializes the iNodes configuration with default values and management info.","         * @method _initNodes","         * @param parentINode {Object} Parent of the iNodes to be set","         * @private","         */","        _initNodes: function (parentINode) {","            var self = this,","                dynLoad = !!self.get(DYNAMIC_LOADER);","            YArray.each(parentINode.children, function (iNode) {","                if (!self._focusedINode) {","                    self._focusedINode = iNode;","                }","                iNode._parent = parentINode;","                iNode.id = iNode.id || Y.guid();","                if (dynLoad && !iNode.children) {","                    iNode.expanded = !!iNode.isLeaf;","                } else {","                    iNode.expanded = (iNode.expanded === undefined) || !!iNode.expanded;","                }","                self._initNodes(iNode);","            });","        },","		/**","		 * Widget lifecyle method.","         *","         * Gets the HTML markup for the visible nodes and inserts it into the contentbox.","		 * @method renderUI","		 * @protected","		 */","		renderUI: function () {","            this.get(CBX).setHTML(this._getHTML());","        },","        /**","         * Initializes the events for its internal use and those requested in","         * the {{#crossLink \"_domEvents\"}}{{/crossLink}} array.","         * @method bindUI","         * @protected","         */","        bindUI: function() {","            var self = this;","","            self._eventHandles.push(self.after('focus', self._afterFocus));","            if (self._domEvents) {","                YArray.each(self._domEvents, function (event) {","                    self._eventHandles.push(self.after(event, self._afterDomEvent, self));","                });","            }","        },","        /**","         * Overrides the native `fire` method so that for DOM events,","         * it will fetch from the pool the fwNode that should have received","         * the event and add it to the event facade as property `node`.","         *","         * @method fire","         * @param type {String|Object} The type of the event, or an object that contains","         * a 'type' property.","         * @param arguments {Object*} an arbitrary set of parameters to pass to","         * the handler. If the first of these is an object literal and the event is","         * configured to emit an event facade, the event facade will replace that","         * parameter after the properties the object literal contains are copied to","         * the event facade.","         * @return {Boolean} false if the event was halted.","         */","        fire: function (type, ev) {","            var ret, self = this;","            if (ev && ev.domEvent) {","                ev.node = self._poolFetchFromEvent(ev);","                ret = FWMgr.superclass.fire.call(self, type, ev);","                self._poolReturn(ev.node);","                return ret;","            }","            return FWMgr.superclass.fire.apply(self, arguments);","        },","        /**","         * Expands all the nodes of the tree.","         *","         * It will only expand existing nodes.  If there is a {{#crossLink \"dynamicLoader:attribute\"}}{{/crossLink}} configured","         * it will not expand those since that might lead to extreme situations.","         * @method expandAll","         * @chainable","         */","        expandAll: function () {","            this._forSomeINode(function(iNode) {","                if (iNode.children && !iNode.expanded) {","                    this._poolReturn(this._poolFetch(iNode).set(EXPANDED, true));","                }","            });","        },","","        /** Generic event listener for DOM events listed in the {{#crossLink \"_domEvents\"}}{{/crossLink}} array.","         *  It will locate the iNode represented by the UI elements that received the event,","         *  slide a suitable instance on it and fire the same event on that node.","         *  @method _afterEvent","         *  @param ev {EventFacade} Event facade as produced by the event","         *  @private","         */","        _afterDomEvent: function(ev) {","            var fwNode =  ev.node;","            if (fwNode) {","                fwNode.fire(ev.type.split(':')[1], {domEvent:ev.domEvent});","            }","        },","        /**","         * Returns a string identifying the type of the object to handle the iNode","         * or null if type was not a FlyweightNode instance.","         * @method _getTypeString","         * @param iNode {Object} Internal node in the tree configuration","         * @return {String} type of iNode.","         * @private","         */","        _getTypeString: function (iNode) {","            var type = iNode.type || DEFAULT_POOL;","            if (!Lang.isString(type)) {","                if (Lang.isObject(type)) {","                    type = type.NAME;","                } else {","                    throw \"Node contains unknown type\";","                }","            }","            return type;","        },","        /**","         * Pulls from the pool an instance of the type declared in the given iNode","         * and slides it over that iNode.","         * If there are no instances of the given type in the pool, a new one will be created via {{#crossLink \"_createNode\"}}{{/crossLink}}","         * If an instance is held (see: {{#crossLink \"FlyweightTreeNode/hold\"}}{{/crossLink}}), it will be returned instead.","         * @method _poolFetch","         * @param iNode {Object} reference to a iNode within the configuration tree","         * @return {FlyweightTreeNode} Usually a subclass of FlyweightTreeNode positioned over the given iNode","         * @protected","         */","        _poolFetch: function(iNode) {","            var pool,","                fwNode = iNode._held,","                type = this._getTypeString(iNode);","","            if (fwNode) {","                return fwNode;","            }","            pool = this._pool[type];","            if (pool === undefined) {","                pool = this._pool[type] = [];","            }","            if (pool.length) {","                fwNode = pool.pop();","                fwNode._slideTo(iNode);","                return fwNode;","            }","            return this._createNode(iNode);","        },","        /**","         * Returns the FlyweightTreeNode instance to the pool.","         * Instances held (see: {{#crossLink \"FlyweightTreeNode/hold\"}}{{/crossLink}}) are never returned.","         * @method _poolReturn","         * @param fwNode {FlyweightTreeNode} Instance to return.","         * @protected","         */","        _poolReturn: function (fwNode) {","            if (fwNode._iNode._held) {","                return;","            }","            var pool,","                type = this._getTypeString(fwNode._iNode);","            pool = this._pool[type];","            if (pool) {","                pool.push(fwNode);","            }","","        },","        /**","         * Returns a new instance of the type given in iNode or the","         * {{#crossLink \"defaultType\"}}{{/crossLink}} if none specified","         * and slides it on top of the iNode provided.","         * @method _createNode","         * @param iNode {Object} reference to a iNode within the configuration tree","         * @return {FlyweightTreeNode} Instance of the corresponding subclass of FlyweightTreeNode","         * @protected","         */","        _createNode: function (iNode) {","            var newNode,","                Type = iNode.type || this.get('defaultType');","            if (Lang.isString(Type)) {","                Type = Y[Type];","            }","            if (Type) {","                newNode = new Type({root:this});","                if (newNode instanceof Y.FlyweightTreeNode) {","                    // I need to do this otherwise Attribute will initialize","                    // the real iNode with default values when activating a lazyAdd attribute.","                    newNode._slideTo({});","                    YArray.each(Y.Object.keys(newNode._state.data), newNode._addLazyAttr, newNode);","                    // newNode.getAttrs();","                    // That's it (see above)","                    newNode._root =  this;","                    newNode._slideTo(iNode);","                    return newNode;","                }","            }","            return null;","        },","        /**","         * Returns an instance of Flyweight node positioned over the root","         * @method getRoot","         * @return {FlyweightTreeNode}","         */","        getRoot: function () {","            return this._poolFetch(this._tree);","        },","        /**","         * Returns a string with the markup for the whole tree.","         * A subclass might opt to produce markup for those parts visible. (lazy rendering)","         * @method _getHTML","         * @return {String} HTML for this widget","         * @protected","         */","        _getHTML: function () {","            var s = '',","                root = this.getRoot();","            root.forSomeChildren( function (fwNode, index, array) {","                s += fwNode._getHTML(index, array.length, 0);","            });","            this._poolReturn(root);","            return s;","        },","        /**","         * Locates a iNode in the tree by the element that represents it.","         * @method _findINodeByElement","         * @param el {Node} Any element belonging to the tree","         * @return {Object} iNode that produced the markup for that element or null if not found","         * @protected","         */","        _findINodeByElement: function(el) {","            var id = el.ancestor(DOT + FWNode.CNAME_NODE, true).get('id'),","                found = null,","                scan = function (iNode) {","                    if (iNode.id === id) {","                        found = iNode;","                        return true;","                    }","                    if (iNode.children) {","                        return YArray.some(iNode.children, scan);","                    }","                    return false;","                };","            if (scan(this._tree)) {","                return found;","            }","            return null;","        },","        /**","         * Returns a FlyweightTreeNode instance from the pool, positioned over the iNode whose markup generated some event.","         * @method _poolFetchFromEvent","         * @param ev {EventFacade}","         * @return {FlyweightTreeNode} The FlyweightTreeNode instance or null if not found.","         * @private","         */","        _poolFetchFromEvent: function (ev) {","            var found = this._findINodeByElement(ev.domEvent.target);","            if (found) {","                return this._poolFetch(found);","            }","            return null;","        },","        /**","         * Traverses the whole configuration tree, calling a given function for each iNode.","         * If the function returns true, the traversing will terminate.","         * @method _forSomeINode","         * @param fn {Function} Function to call on each configuration iNode","         *		@param fn.iNode {Object} iNode in the configuration tree","         *		@param fn.depth {Integer} depth of this iNode within the tree","         *		@param fn.index {Integer} index of this iNode within the array of its siblings","         * @param scope {Object} scope to run the function in, defaults to `this`.","         * @return true if any of the function calls returned true (the traversal was terminated earlier)","         * @protected","         */","        _forSomeINode: function(fn, scope) {","            scope = scope || this;","            var loop = function(iNode, depth) {","                return YArray.some(iNode.children || [], function(childINode, index) {","                    if (fn.call(scope, childINode,depth, index)) {","                        return true;","                    }","                    return loop(childINode,depth + 1);","                });","            };","            return loop(this._tree, 0);","        },","        /**","         * Executes the given function over all the nodes in the tree or until the function returns true.","         * If dynamic loading is enabled, it will not run over nodes not yet loaded.","         * @method forSomeNodes","         * @param fn {function} function to execute on each node.  It will receive:","         *	@param fn.node {FlyweightTreeNode} node being visited.","         *	@param fn.depth {Integer} depth from the root. The root node is level zero and it is not traversed.","         *	@param fn.index {Integer} position of this node within its branch","         *	@param fn.array {Array} array containing itself and its siblings","         * @param scope {Object} Scope to run the function in.  Defaults to the FlyweightTreeManager instance.","         * @return {Boolean} true if any function calls returned true (the traversal was interrupted)","         */","        forSomeNodes: function (fn, scope) {","            scope = scope || this;","","            var forOneLevel = function (fwNode, depth) {","                fwNode.forSomeChildren(function (fwNode, index, array) {","                    if (fn.call(scope, fwNode, depth, index, array) === true) {","                        return true;","                    }","                    return forOneLevel(fwNode, depth+1);","                });","            };","            return forOneLevel(this.getRoot(), 1);","        },","        /**","         * Getter for the {{#crossLink \"focusedNode:attribute\"}}{{/crossLink}} attribute","         * @method _focusedNodeGetter","         * @return {FlyweightNode} Node that would have the focus if the widget is focused","         * @private","         */","        _focusedNodeGetter: function () {","            return this._poolFetch(this._focusedINode);","        },","        /**","         * Setter for the {{#crossLink \"focusedNode:attribute\"}}{{/crossLink}} attribute","         * @method _focusedNodeSetter","         * @param value {FlyweightNode} Node to receive the focus.","         * @return {Object} iNode matching the focused node.","         * @private","         */","        _focusedNodeSetter: function (value) {","            if (!value || value instanceof Y.FlyweightTreeNode) {","                var newINode = (value?value._iNode:this._tree.children[0]);","                this._focusOnINode(newINode);","                return newINode;","            } else {","                return Y.Attribute.INVALID_VALUE;","            }","        },","        /**","         * Sets the focus on the given iNode","         * @method _focusOnINode","         * @param iNode {Object} iNode to receive the focus","         * @private","         */","        _focusOnINode: function (iNode) {","            var prevINode = this._focusedINode,","                el;","","            if (iNode && iNode !== prevINode) {","","                el = Y.one('#' + prevINode.id + ' .' + CNAME_CONTENT);","                el.blur();","                el.set(TABINDEX, -1);","","                el = Y.one('#' + iNode.id + ' .' + CNAME_CONTENT);","                el.focus();","                el.set(TABINDEX,0);","","                this._focusedINode = iNode;","            }","","        },","        /**","         * Setter for the {{#crossLink \"dynamicLoader:attribute\"}}{{/crossLink}} attribute.","         * It changes the expanded attribute to false on childless iNodes not marked with `isLeaf","         * since they can now be expanded.","         * @method","         * @param value {Function | null } Function to handle the loading of nodes on demand","         * @return {Function | null | INVALID_VALUE} function set or rejection","         * @private","         */","        _dynamicLoaderSetter: function (value) {","            if (!Lang.isFunction(value) &&  value !== null) {","                return Y.Attribute.INVALID_VALUE;","            }","            if (value) {","                this._forSomeINode(function(iNode) {","                    if (!iNode.children) {","                        iNode.expanded = !!iNode.isLeaf;","                    }","                });","            }","            return value;","        }","    },","    {","        ATTRS: {","            /**","             * Default object type of the nodes if no explicit type is given in the configuration tree.","             * It can be specified as an object reference, these two are equivalent: `Y.FWTreeNode` or  `'FWTreeNode'`.","             *","             * @attribute defaultType","             * @type {String | Object}","             * @default 'FlyweightTreeNode'","             */","            defaultType: {","                value: 'FlyweightTreeNode'","            },","            /**","             * Function used to load the nodes dynamically.","             * Function will run in the scope of the FlyweightTreeManager instance and will","             * receive:","             *","             * * node {FlyweightTreeNode} reference to the parent of the children to be loaded.","             * * callback {Function} function to call with the configuration info for the children.","             *","             * The function shall fetch the nodes and create a configuration object","             * much like the one a whole tree might receive.","             * It is not limited to just one level of nodes, it might contain children elements as well.","             * When the data is processed, it should call the callback with the configuration object.","             * The function is responsible of handling any errors.","             * If the the callback is called with no arguments, the parent node will be marked as having no children.","             *","             * This attribute should be set before the tree is rendered as childless nodes","             * render differently when there is a dynamic loader than when there isn't.","             * (childless nodes can be expanded when a dynamic loader is present and the UI should reflect that).","             * @attribute dynamicLoader","             * @type {Function or null}","             * @default null","             */","            dynamicLoader: {","                value: null,","                setter: '_dynamicLoaderSetter'","            },","            /**","             * Points to the node that currently has the focus.","             * If read, please make sure to release the node instance to the pool when done.","             * @attribute focusedNode","             * @type FlyweightTreeNode","             * @default First node in the tree","             */","            focusedNode: {","                getter: '_focusedNodeGetter',","                setter: '_focusedNodeSetter'","                // There is no need for validator since the setter already takes care of validation.","            }","","        }","    });","","","Y.FlyweightTreeManager = FWMgr;","/**","* An implementation of the flyweight pattern.","* This object can be slid on top of a literal object containing the definition","* of a tree and will take its state from that iNode it is slid upon.","* It relies for most of its functionality on the flyweight manager object,","* which contains most of the code.","* @module gallery-flyweight-tree","*/","","/**","* An implementation of the flyweight pattern.  This class should not be instantiated directly.","* Instances of this class can be requested from the flyweight manager class","* @class FlyweightTreeNode","* @extends Base","* @constructor  Do not instantiate directly.","*/","FWNode = Y.Base.create(","	FWNODE_NAME,","	Y.Base,","	[],","	{","		/**","		 * Reference to the iNode in the configuration tree it has been slid over.","		 * @property _iNode","		 * @type {Object}","		 * @private","		 **/","		_iNode:null,","		/**","		 * Reference to the FlyweightTreeManager instance this node belongs to.","		 * It is set by the root and should be considered read-only.","		 * @property _root","		 * @type FlyweightTreeManager","		 * @private","		 */","		_root: null,","        /**","         * Standard lifecycle method, reads the root node from the config","         * @method initializer","         * @param cfg {object} configuration data","         * @protected","         */","        initializer: function (cfg) {","            this._root = cfg.root;","        },","		/**","		 * Returns a string with the markup for this node along that of its children","		 * produced from its attributes rendered","		 * via the first template string it finds in these locations:","		 *","		 * * It's own {{#crossLink \"template\"}}{{/crossLink}} configuration attribute","		 * * The static {{#crossLink \"FlyweightTreeNode/TEMPLATE\"}}{{/crossLink}} class property","		 *","		 * @method _getHTML","		 * @param index {Integer} index of this node within the array of siblings","		 * @param nSiblings {Integer} number of siblings including this node","		 * @param depth {Integer} number of levels to the root","		 * @return {String} markup generated by this node","		 * @protected","		 */","		_getHTML: function(index, nSiblings, depth) {","			// assumes that if you asked for the HTML it is because you are rendering it","			var root = this._root,","                iNode = this._iNode,","				attrs = this.getAttrs(),","				s = '',","				templ = iNode.template,","				childCount = iNode.children && iNode.children.length,","				nodeClasses = [CNAME_NODE],","				superConstructor = this.constructor;","","			while (!templ) {","				templ = superConstructor.TEMPLATE;","				superConstructor = superConstructor.superclass.constructor;","","			}","","			iNode._rendered = true;","			if (childCount) {","				if (attrs.expanded) {","					iNode._childrenRendered = true;","					this.forSomeChildren( function (fwNode, index, array) {","						s += fwNode._getHTML(index, array.length, depth + 1);","					});","					nodeClasses.push(CNAME_EXPANDED);","				} else {","					nodeClasses.push(CNAME_COLLAPSED);","				}","			} else {","				if (this._root.get(DYNAMIC_LOADER) && !iNode.isLeaf) {","					nodeClasses.push(CNAME_COLLAPSED);","				} else {","					nodeClasses.push(CNAME_NOCHILDREN);","				}","			}","			if (index === 0) {","				nodeClasses.push(CNAME_FIRSTCHILD);","			}","			if (index === nSiblings - 1) {","				nodeClasses.push(CNAME_LASTCHILD);","			}","			attrs.children = s;","			attrs.cname_node = nodeClasses.join(' ');","			attrs.cname_content = CNAME_CONTENT;","			attrs.cname_children = CNAME_CHILDREN;","            attrs.tabIndex = (iNode === root._focusedINode)?0:-1;","","			return Lang.sub(templ, attrs);","","		},","		/**","		 * Method to slide this instance on top of another iNode in the configuration object","		 * @method _slideTo","		 * @param iNode {Object} iNode in the underlying configuration tree to slide this object on top of.","		 * @private","		 */","		_slideTo: function (iNode) {","			this._iNode = iNode;","			this._stateProxy = iNode;","		},","		/**","		 * Executes the given function on each of the child nodes of this node.","		 * @method forSomeChildren","		 * @param fn {Function} Function to be executed on each node","		 *		@param fn.child {FlyweightTreeNode} Instance of a suitable subclass of FlyweightTreeNode,","		 *		positioned on top of the child node","		 *		@param fn.index {Integer} Index of this child within the array of children","		 *		@param fn.array {Array} array containing itself and its siblings","		 * @param scope {object} The falue of this for the function.  Defaults to the parent.","		**/","		forSomeChildren: function(fn, scope) {","			var root = this._root,","				children = this._iNode.children,","				child, ret;","			scope = scope || this;","			if (children && children.length) {","				YArray.some(children, function (iNode, index, array) {","					child = root._poolFetch(iNode);","					ret = fn.call(scope, child, index, array);","					root._poolReturn(child);","					return ret;","				});","			}","		},","		/**","		 * Getter for the expanded configuration attribute.","		 * It is meant to be overriden by the developer.","		 * The supplied version defaults to true if the expanded property","		 * is not set in the underlying configuration tree.","		 * It can be overriden to default to false.","		 * @method _expandedGetter","		 * @return {Boolean} The expanded state of the node.","		 * @protected","		 */","		_expandedGetter: function () {","			return this._iNode.expanded !== false;","		},","		/**","		 * Setter for the expanded configuration attribute.","		 * It renders the child nodes if this branch has never been expanded.","		 * Then sets the className on the node to the static constants","		 * CNAME_COLLAPSED or CNAME_EXPANDED from Y.FlyweightTreeManager","		 * @method _expandedSetter","		 * @param value {Boolean} new value for the expanded attribute","		 * @private","		 */","		_expandedSetter: function (value) {","			var self = this,","				iNode = self._iNode,","				root = self._root,","				el = Y.one('#' + iNode.id),","				dynLoader = root.get(DYNAMIC_LOADER);","","			iNode.expanded = value = !!value;","			if (dynLoader && !iNode.isLeaf && (!iNode.children  || !iNode.children.length)) {","				this._loadDynamic();","				return;","			}","			if (iNode.children && iNode.children.length) {","				if (value) {","					if (!iNode._childrenRendered) {","						self._renderChildren();","					}","					el.replaceClass(CNAME_COLLAPSED, CNAME_EXPANDED);","				} else {","					el.replaceClass(CNAME_EXPANDED, CNAME_COLLAPSED);","				}","			}","            el.set('aria-expanded', String(value));","		},","		/**","		 * Triggers the dynamic loading of children for this node.","		 * @method _loadDynamic","		 * @private","		 */","		_loadDynamic: function () {","			var self = this,","				root = self._root;","			Y.one('#' + this.get('id')).replaceClass(CNAME_COLLAPSED, CNAME_LOADING);","			root.get(DYNAMIC_LOADER).call(root, self, Y.bind(self._dynamicLoadReturn, self));","","		},","		/**","		 * Callback for the dynamicLoader method.","		 * @method _dynamicLoadReturn","		 * @param response {Array} array of child iNodes","		 * @private","		 */","		_dynamicLoadReturn: function (response) {","			var self = this,","				iNode = self._iNode,","				root = self._root;","","			if (response) {","","				iNode.children = response;","				root._initNodes(iNode);","				self._renderChildren();","			} else {","				iNode.isLeaf = true;","			}","			// isLeaf might have been set in the response, not just in the line above.","			Y.one('#' + iNode.id).replaceClass(CNAME_LOADING, (iNode.isLeaf?CNAME_NOCHILDREN:CNAME_EXPANDED));","		},","		/**","		 * Renders the children of this node.","		 * It the children had been rendered, they will be replaced.","		 * @method _renderChildren","		 * @private","		 */","		_renderChildren: function () {","			var s = '',","				iNode = this._iNode,","				depth = this.get('depth');","			iNode._childrenRendered = true;","			this.forSomeChildren(function (fwNode, index, array) {","				s += fwNode._getHTML(index, array.length, depth + 1);","			});","			Y.one('#' + iNode.id + ' .' + CNAME_CHILDREN).setContent(s);","		},","		/**","		 * Prevents this instance from being returned to the pool and reused.","		 * Remember to {{#crossLink \"release\"}}{{/crossLink}} this instance when no longer needed.","		 * @method hold","		 * @chainable","		 */","		hold: function () {","			return (this._iNode._held = this);","		},","		/**","		 * Allows this instance to be returned to the pool and reused.","		 *","		 * __Important__: This instance should not be used after being released","		 * @method release","		 * @chainable","		 */","		release: function () {","			this._iNode._held = null;","			this._root._poolReturn(this);","			return this;","		},","		/**","		 * Returns the parent node for this node or null if none exists.","		 * The copy is not on {{#crossLink \"hold\"}}{{/crossLink}}.","		 * Remember to release the copy to the pool when done.","		 * @method getParent","		 * @return FlyweightTreeNode","		 */","		getParent: function() {","			var iNode = this._iNode._parent;","			return (iNode?this._root._poolFetch(iNode):null);","		},","		/**","		 * Returns the next sibling node for this node or null if none exists.","		 * The copy is not on {{#crossLink \"hold\"}}{{/crossLink}}.","		 * Remember to release the copy to the pool when done.","		 * @method getNextSibling","		 * @return FlyweightTreeNode","		 */","		getNextSibling: function() {","			var parent = this._iNode._parent,","				siblings = (parent && parent.children) || [],","				index = siblings.indexOf(this) + 1;","			if (index === 0 || index > siblings.length) {","				return null;","			}","			return this._root._poolFetch(siblings[index]);","		},","		/**","		 * Returns the previous sibling node for this node or null if none exists.","		 * The copy is not on {{#crossLink \"hold\"}}{{/crossLink}}.","		 * Remember to release the copy to the pool when done.","		 * @method getPreviousSibling","		 * @return FlyweightTreeNode","		 */","		getPreviousSibling: function() {","			var parent = this._iNode._parent,","				siblings = (parent && parent.children) || [],","				index = siblings.indexOf(this) - 1;","			if (index < 0) {","				return null;","			}","			return this._root._poolFetch(siblings[index]);","		},","        /**","         * Sets the focus to this node.","         * @method focus","         * @chainable","         */","        focus: function() {","            return this._root.set(FOCUSED, this);","        },","        /**","         * Removes the focus from this node","         * @method blur","         * @chainable","         */","        blur: function () {","            return this._root.set(FOCUSED, null);","        },","		/**","		 * Sugar method to toggle the expanded state of the node.","		 * @method toggle","		 * @chainable","		 */","		toggle: function() {","			return this.set(EXPANDED, !this.get(EXPANDED));","		},","        /**","         * Sugar method to expand a node","         * @method expand","         * @chainable","         */","        expand: function() {","            return this.set(EXPANDED, true);","        },","        /**","         * Sugar method to collapse this node","         * @method collapse","         * @chainable","         */","        collapse: function() {","            return this.set(EXPANDED, false);","        },","		/**","		 * Returns true if this node is the root node","		 * @method isRoot","		 * @return {Boolean} true if root node","		 */","		isRoot: function() {","			return this._root._tree === this._iNode;","		},","		/**","		* Gets the stored value for the attribute, from either the","		* internal state object, or the state proxy if it exits","		*","		* @method _getStateVal","		* @private","		* @param {String} name The name of the attribute","		* @return {Any} The stored value of the attribute","		*/","		_getStateVal : function(name) {","			var iNode = this._iNode;","			if (this._state.get(name, BYPASS_PROXY) || !iNode) {","				return this._state.get(name, VALUE);","			}","			if (iNode.hasOwnProperty(name)) {","				return iNode[name];","			}","			return this._state.get(name, VALUE);","		},","","		/**","		* Sets the stored value for the attribute, in either the","		* internal state object, or the state proxy if it exits","		*","		* @method _setStateVal","		* @private","		* @param {String} name The name of the attribute","		* @param {Any} value The value of the attribute","		*/","		_setStateVal : function(name, value) {","			var iNode = this._iNode;","			if (this._state.get(name, BYPASS_PROXY) || this._state.get(name, 'initializing') || !iNode) {","				this._state.add(name, VALUE, value);","			} else {","				iNode[name] = value;","			}","		}","	},","	{","		/**","		 * Template string to be used to render this node.","		 * It should be overriden by the subclass.","		 *","		 * It contains the HTML markup for this node plus placeholders,","		 * enclosed in curly braces, that have access to any of the","		 * configuration attributes of this node plus several predefined placeholders.","         *","         * It must contain at least three elements identified by their classNames:","","         +----------------------------+","         | {cname_node}               |","         | +------------------------+ |","         | | {cname_content}        | |","         | +------------------------+ |","         |                            |","         | +------------------------+ |","         | | {cname_children}       | |","         | +------------------------+ |","         +----------------------------+","","         * For example:","","         '<div id=\"{id}\" class=\"{cname_node}\" role=\"\" aria-expanded=\"{expanded}\">' +","               '<div tabIndex=\"{tabIndex}\" class=\"{cname_content}\">{label}</div>' +","               '<div class=\"{cname_children}\" role=\"group\">{children}</div>' +","         '</div>'","","         * The outermost container identified by the className `{cname_node}`","         * must also use the `{id}` placeholder to set the `id` of the node.","         * It should also have the proper ARIA role assigned and the","         * `aria-expanded` set to the `{expanded}` placeholder.","         *","         * It must contain two further elements:","         *","         * * A container for the contents of this node, identified by the className","         *   `{cname_content}` which should contain everything the user would associate","         *   with this node, such as the label and other status indicators","         *   such as toggle and selection indicators.","         *   This is the element that would receive the focus of the node, thus,","         *   it must have a `{tabIndex}` placeholder to receive the appropriate","         *   value for the `tabIndex` attribute.","         *","         * * The other element is the container for the children of this node.","         *   It will be identified by the className `{cname_children}` and it","         *   should enclose the placeholder `{children}`.","         *","		 * @property TEMPLATE","		 * @type {String}","		 * @default '<div id=\"{id}\" class=\"{cname_node}\" role=\"\" aria-expanded=\"{expanded}\"><div tabIndex=\"{tabIndex}\"","         class=\"{cname_content}\">{label}</div><div class=\"{cname_children}\" role=\"group\">{children}</div></div>'","		 * @static","		 */","		TEMPLATE: '<div id=\"{id}\" class=\"{cname_node}\" role=\"\" aria-expanded=\"{expanded}\">' +","                        '<div tabIndex=\"{tabIndex}\" class=\"{cname_content}\">{label}</div>' +","                        '<div class=\"{cname_children}\" role=\"group\">{children}</div>' +","                   '</div>',","		/**","		 * CCS className constant to use as the class name for the DOM element representing the node.","		 * @property CNAME_NODE","		 * @type String","		 * @static","		 */","		CNAME_NODE: CNAME_NODE,","		/**","		 * CCS className constant to use as the class name for the DOM element that will contain the label and/or status of this node.","		 * @property CNAME_CONTENT","		 * @type String","		 * @static","		 */","		CNAME_CONTENT: CNAME_CONTENT,","		/**","		 * CCS className constant to use as the class name for the DOM element that will contain the children of this node.","		 * @property CNAME_CHILDREN","		 * @type String","		 * @static","		 */","		CNAME_CHILDREN: CNAME_CHILDREN,","		/**","		 * CCS className constant added to the DOM element for this node when its state is not expanded.","		 * @property CNAME_COLLAPSED","		 * @type String","		 * @static","		 */","		CNAME_COLLAPSED: CNAME_COLLAPSED,","		/**","		 * CCS className constant added to the DOM element for this node when its state is expanded.","		 * @property CNAME_EXPANDED","		 * @type String","		 * @static","		 */","		CNAME_EXPANDED: CNAME_EXPANDED,","		/**","		 * CCS className constant added to the DOM element for this node when it has no children.","		 * @property CNAME_NOCHILDREN","		 * @type String","		 * @static","		 */","		CNAME_NOCHILDREN: CNAME_NOCHILDREN,","		/**","		 * CCS className constant added to the DOM element for this node when it is the first in the group.","		 * @property CNAME_FIRSTCHILD","		 * @type String","		 * @static","		 */","		CNAME_FIRSTCHILD: CNAME_FIRSTCHILD,","		/**","		 * CCS className constant added to the DOM element for this node when it is the last in the group.","		 * @property CNAME_LASTCHILD","		 * @type String","		 * @static","		 */","		CNAME_LASTCHILD: CNAME_LASTCHILD,","		/**","		 * CCS className constant added to the DOM element for this node when dynamically loading its children.","		 * @property CNAME_LOADING","		 * @type String","		 * @static","		 */","		CNAME_LOADING: CNAME_LOADING,","		ATTRS: {","			/**","			 * Reference to the FlyweightTreeManager this node belongs to","			 * @attribute root","			 * @type {FlyweightTreeManager}","			 * @readOnly","			 *","			 */","","			root: {","				_bypassProxy: true,","				readOnly: true,","				getter: function() {","					return this._root;","				}","			},","","			/**","			 * Template to use on this particular instance.","			 * The renderer will default to the static TEMPLATE property of this class","			 * (the preferred way) or the nodeTemplate configuration attribute of the root.","			 * See the TEMPLATE static property.","			 * @attribute template","			 * @type {String}","			 * @default undefined","			 */","			template: {","				validator: Lang.isString","			},","			/**","			 * Label for this node. Nodes usually have some textual content, this is the place for it.","			 * @attribute label","			 * @type {String}","			 * @default ''","			 */","			label: {","				validator: Lang.isString,","				value: ''","			},","			/**","			 * Id to assign to the DOM element that contains this node.","			 * If none was supplied, it will generate one","			 * @attribute id","			 * @type {Identifier}","			 * @default guid()","			 * @readOnly","			 */","			id: {","				readOnly: true","			},","			/**","			 * Returns the depth of this node from the root.","			 * This is calculated on-the-fly.","			 * @attribute depth","			 * @type Integer","			 * @readOnly","			 */","			depth: {","				_bypassProxy: true,","				readOnly: true,","				getter: function () {","					var count = 0,","						iNode = this._iNode;","					while (iNode._parent) {","						count += 1;","						iNode = iNode._parent;","					}","					return count-1;","				}","			},","			/**","			 * Expanded state of this node.","			 * @attribute expanded","			 * @type Boolean","			 * @default true","			 */","			expanded: {","				_bypassProxy: true,","				getter: '_expandedGetter',","				setter: '_expandedSetter'","			}","		}","	}",");","Y.FlyweightTreeNode = FWNode;","","","","}, '@VERSION@', {\"requires\": [\"widget\", \"base-build\"], \"skinnable\": false});"];
_yuitest_coverage["build/gallery-flyweight-tree/gallery-flyweight-tree.js"].lines = {"1":0,"3":0,"5":0,"23":0,"68":0,"128":0,"129":0,"137":0,"138":0,"140":0,"141":0,"142":0,"144":0,"170":0,"173":0,"182":0,"184":0,"185":0,"186":0,"188":0,"189":0,"190":0,"191":0,"193":0,"195":0,"206":0,"215":0,"217":0,"218":0,"219":0,"220":0,"240":0,"241":0,"242":0,"243":0,"244":0,"245":0,"247":0,"258":0,"259":0,"260":0,"273":0,"274":0,"275":0,"287":0,"288":0,"289":0,"290":0,"292":0,"295":0,"308":0,"312":0,"313":0,"315":0,"316":0,"317":0,"319":0,"320":0,"321":0,"322":0,"324":0,"334":0,"335":0,"337":0,"339":0,"340":0,"341":0,"355":0,"357":0,"358":0,"360":0,"361":0,"362":0,"365":0,"366":0,"369":0,"370":0,"371":0,"374":0,"382":0,"392":0,"394":0,"395":0,"397":0,"398":0,"408":0,"411":0,"412":0,"413":0,"415":0,"416":0,"418":0,"420":0,"421":0,"423":0,"433":0,"434":0,"435":0,"437":0,"452":0,"453":0,"454":0,"455":0,"456":0,"458":0,"461":0,"476":0,"478":0,"479":0,"480":0,"481":0,"483":0,"486":0,"495":0,"505":0,"506":0,"507":0,"508":0,"510":0,"520":0,"523":0,"525":0,"526":0,"527":0,"529":0,"530":0,"531":0,"533":0,"547":0,"548":0,"550":0,"551":0,"552":0,"553":0,"557":0,"616":0,"633":0,"660":0,"679":0,"688":0,"689":0,"690":0,"694":0,"695":0,"696":0,"697":0,"698":0,"699":0,"701":0,"703":0,"706":0,"707":0,"709":0,"712":0,"713":0,"715":0,"716":0,"718":0,"719":0,"720":0,"721":0,"722":0,"724":0,"734":0,"735":0,"748":0,"751":0,"752":0,"753":0,"754":0,"755":0,"756":0,"757":0,"772":0,"784":0,"790":0,"791":0,"792":0,"793":0,"795":0,"796":0,"797":0,"798":0,"800":0,"802":0,"805":0,"813":0,"815":0,"816":0,"826":0,"830":0,"832":0,"833":0,"834":0,"836":0,"839":0,"848":0,"851":0,"852":0,"853":0,"855":0,"864":0,"874":0,"875":0,"876":0,"886":0,"887":0,"897":0,"900":0,"901":0,"903":0,"913":0,"916":0,"917":0,"919":0,"927":0,"935":0,"943":0,"951":0,"959":0,"967":0,"979":0,"980":0,"981":0,"983":0,"984":0,"986":0,"999":0,"1000":0,"1001":0,"1003":0,"1141":0,"1189":0,"1191":0,"1192":0,"1193":0,"1195":0,"1212":0};
_yuitest_coverage["build/gallery-flyweight-tree/gallery-flyweight-tree.js"].functions = {"cName:22":0,"initializer:127":0,"(anonymous 2):137":0,"(anonymous 3):141":0,"destructor:136":0,"_loadConfig:169":0,"(anonymous 4):184":0,"_initNodes:181":0,"renderUI:205":0,"(anonymous 5):219":0,"bindUI:214":0,"fire:239":0,"(anonymous 6):258":0,"expandAll:257":0,"_afterDomEvent:272":0,"_getTypeString:286":0,"_poolFetch:307":0,"_poolReturn:333":0,"_createNode:354":0,"getRoot:381":0,"(anonymous 7):394":0,"_getHTML:391":0,"scan:410":0,"_findINodeByElement:407":0,"_poolFetchFromEvent:432":0,"(anonymous 8):454":0,"loop:453":0,"_forSomeINode:451":0,"(anonymous 9):479":0,"forOneLevel:478":0,"forSomeNodes:475":0,"_focusedNodeGetter:494":0,"_focusedNodeSetter:504":0,"_focusOnINode:519":0,"(anonymous 10):551":0,"_dynamicLoaderSetter:546":0,"initializer:659":0,"(anonymous 11):698":0,"_getHTML:677":0,"_slideTo:733":0,"(anonymous 12):753":0,"forSomeChildren:747":0,"_expandedGetter:771":0,"_expandedSetter:783":0,"_loadDynamic:812":0,"_dynamicLoadReturn:825":0,"(anonymous 13):852":0,"_renderChildren:847":0,"hold:863":0,"release:873":0,"getParent:885":0,"getNextSibling:896":0,"getPreviousSibling:912":0,"focus:926":0,"blur:934":0,"toggle:942":0,"expand:950":0,"collapse:958":0,"isRoot:966":0,"_getStateVal:978":0,"_setStateVal:998":0,"getter:1140":0,"getter:1188":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-flyweight-tree/gallery-flyweight-tree.js"].coveredLines = 238;
_yuitest_coverage["build/gallery-flyweight-tree/gallery-flyweight-tree.js"].coveredFunctions = 64;
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 1);
YUI.add('gallery-flyweight-tree', function (Y, NAME) {

_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 3);
'use strict';
/*jslint white: true */
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 5);
var Lang = Y.Lang,
	YArray = Y.Array,

    DOT = '.',
	BYPASS_PROXY = "_bypassProxy",
	CBX = 'contentBox',
	VALUE = 'value',
    EXPANDED = 'expanded',
    DYNAMIC_LOADER = 'dynamicLoader',
    TABINDEX = 'tabIndex',
    FOCUSED = 'focused',

    DEFAULT_POOL = '_default',

    getCName = Y.ClassNameManager.getClassName,
    FWNODE_NAME = 'flyweight-tree-node',
	CNAME_NODE = getCName(FWNODE_NAME),
	cName = function (name) {
		_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "cName", 22);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 23);
return getCName(FWNODE_NAME, name);
	},
    CNAME_CONTENT = cName('content'),
	CNAME_CHILDREN = cName('children'),
	CNAME_COLLAPSED = cName('collapsed'),
	CNAME_EXPANDED = cName(EXPANDED),
	CNAME_NOCHILDREN = cName('no-children'),
	CNAME_FIRSTCHILD = cName('first-child'),
	CNAME_LASTCHILD = cName('last-child'),
	CNAME_LOADING = cName('loading'),

	FWMgr,
	FWNode;

/**
* @module gallery-flyweight-tree
*
*/

/**
 * Widget to handle its child nodes by using the flyweight pattern.
 *
 * The information for the tree is stored internally in a plain object without methods,
 * events or attributes.
 * This manager will position FlyweightTreeNode instances (or subclasses of it)
 * over these iNodes from a small pool of them, in order to save memory.
 *
 * The nodes on this configuration tree are referred to in this documentation as `iNodes`
 * for 'internal nodes', to tell them apart from the pooled FlyweightTreeNode instances
 * that will be used to manipulate them.  The FlyweightTreeNode instances will usually
 * be declared as `fwNodes` when confusion might arise.
 * If a variable or argument is not explicitly named `iNode` or a related name it is
 * FlyweightTreeNode instance.
 *
 * The developer should not be concerned about the iNodes,
 * except in the initial configuration tree.
 * If the developer finds anything that needs to be done through iNodes,
 * it is a bug and should be reported (thanks).
 * iNodes should be private.
 *
 * @class FlyweightTreeManager
 * @extends Widget
 * @constructor
 */

_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 68);
FWMgr = Y.Base.create(
    NAME,
    Y.Widget,
    [],
    {
        /**
         * Clone of the configuration tree.
         * The FlyweightTreeNode instances will use the iNodes (internal nodes) in this tree as the storage for their state.
         * @property _tree
         * @type Object
         * @private
         */
        _tree: null,
        /**
         * Pool of FlyweightTreeNode instances to use and reuse by the manager.
         * It contains a hash of arrays indexed by the iNode (internal node) type.
         * Each array contains a series of FlyweightTreeNode subclasses of the corresponding type.
         * @property _pool
         * @type {Object}
         * @private
         */
        _pool: null,
        /**
         * List of dom events to be listened for at the outer container and fired again
         * at the FlyweightTreeNode level once positioned over the source iNode.
         *
         * Since the node instances are not actually there, they can't listen to the events themselves
         * so the events listed here will serve to wake up those instances and get the event
         * as if they had been there all along.
         * @property _domEvents
         * @type Array of strings
         * @protected
         * @default null
         */
        _domEvents: null,
        /**
         * Reference to the element that has the focus or should have the focus
         * when this widget is active (ie, tabbed into).
         * Mostly used for WAI-ARIA support.
         * @property _focusedINode
         * @type FlyweightTreeNode
         * @private
         * @default null
         */
        _focusedINode: null,

        /**
         * Event handles of events subscribed to, to detach them on destroy
         * @property _eventHandles
         * @type Array of EventHandles
         * @private
         */
        _eventHandles: null,

        /**
         * Part of the Widget lifecycle.
         * @method initializer
         * @protected
         */
        initializer:function () {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "initializer", 127);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 128);
this._pool = {};
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 129);
this._eventHandles = [];
        },
        /**
         * Part of the lifecycle.  Destroys the pools.
         * @method destructor
         * @protected
         */
        destructor: function () {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "destructor", 136);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 137);
YArray.each(this._pool, function (fwNode) {
                _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 2)", 137);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 138);
fwNode.destroy();
            });
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 140);
this._pool = null;
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 141);
YArray.each(this._eventHandles, function (evHandle) {
                _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 3)", 141);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 142);
evHandle.detach();
            });
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 144);
this._eventHandles = null;

        },
        /**
         * Method to load the configuration tree.
         * The nodes in this tree are copied into iNodes (internal nodes) for internal use.
         *
         * The initializer does not load the tree automatically so as to allow the subclass
         * of this manager
         * to process the tree definition anyway it wants, adding defaults and such
         * and to name the tree whatever is suitable.
         * For TreeView, the configuration property is named `tree`, for a form, it is named `form`.
         * It also sets initial values for some default properties such as `parent` references and `id` for all iNodes.
         * @method _loadConfig
         * @param tree {Array} Configuration for the first level of nodes.
         * Contains objects with the following attributes:
         * @param tree.label {String} Text or HTML markup to be shown in the node
         * @param [tree.expanded=true] {Boolean} Whether the children of this node should be visible.
         * @param [tree.children] {Array} Further definitions for the children of this node
         * @param [tree.type=FWTreeNode] {FWTreeNode | String} Class used to create instances for this iNode.
         * It can be a reference to an object or a name that can be resolved as `Y[name]`.
         * @param [tree.id=Y.guid()] {String} Identifier to assign to the DOM element containing the UI for this node.
         * @param [tree.template] {String} Template for this particular node.
         * @protected
         */
        _loadConfig: function (tree) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_loadConfig", 169);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 170);
this._tree = {
                children: Y.clone(tree)
            };
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 173);
this._initNodes(this._tree);

        },
        /** Initializes the iNodes configuration with default values and management info.
         * @method _initNodes
         * @param parentINode {Object} Parent of the iNodes to be set
         * @private
         */
        _initNodes: function (parentINode) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_initNodes", 181);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 182);
var self = this,
                dynLoad = !!self.get(DYNAMIC_LOADER);
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 184);
YArray.each(parentINode.children, function (iNode) {
                _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 4)", 184);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 185);
if (!self._focusedINode) {
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 186);
self._focusedINode = iNode;
                }
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 188);
iNode._parent = parentINode;
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 189);
iNode.id = iNode.id || Y.guid();
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 190);
if (dynLoad && !iNode.children) {
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 191);
iNode.expanded = !!iNode.isLeaf;
                } else {
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 193);
iNode.expanded = (iNode.expanded === undefined) || !!iNode.expanded;
                }
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 195);
self._initNodes(iNode);
            });
        },
		/**
		 * Widget lifecyle method.
         *
         * Gets the HTML markup for the visible nodes and inserts it into the contentbox.
		 * @method renderUI
		 * @protected
		 */
		renderUI: function () {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "renderUI", 205);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 206);
this.get(CBX).setHTML(this._getHTML());
        },
        /**
         * Initializes the events for its internal use and those requested in
         * the {{#crossLink "_domEvents"}}{{/crossLink}} array.
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "bindUI", 214);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 215);
var self = this;

            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 217);
self._eventHandles.push(self.after('focus', self._afterFocus));
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 218);
if (self._domEvents) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 219);
YArray.each(self._domEvents, function (event) {
                    _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 5)", 219);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 220);
self._eventHandles.push(self.after(event, self._afterDomEvent, self));
                });
            }
        },
        /**
         * Overrides the native `fire` method so that for DOM events,
         * it will fetch from the pool the fwNode that should have received
         * the event and add it to the event facade as property `node`.
         *
         * @method fire
         * @param type {String|Object} The type of the event, or an object that contains
         * a 'type' property.
         * @param arguments {Object*} an arbitrary set of parameters to pass to
         * the handler. If the first of these is an object literal and the event is
         * configured to emit an event facade, the event facade will replace that
         * parameter after the properties the object literal contains are copied to
         * the event facade.
         * @return {Boolean} false if the event was halted.
         */
        fire: function (type, ev) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "fire", 239);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 240);
var ret, self = this;
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 241);
if (ev && ev.domEvent) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 242);
ev.node = self._poolFetchFromEvent(ev);
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 243);
ret = FWMgr.superclass.fire.call(self, type, ev);
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 244);
self._poolReturn(ev.node);
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 245);
return ret;
            }
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 247);
return FWMgr.superclass.fire.apply(self, arguments);
        },
        /**
         * Expands all the nodes of the tree.
         *
         * It will only expand existing nodes.  If there is a {{#crossLink "dynamicLoader:attribute"}}{{/crossLink}} configured
         * it will not expand those since that might lead to extreme situations.
         * @method expandAll
         * @chainable
         */
        expandAll: function () {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "expandAll", 257);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 258);
this._forSomeINode(function(iNode) {
                _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 6)", 258);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 259);
if (iNode.children && !iNode.expanded) {
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 260);
this._poolReturn(this._poolFetch(iNode).set(EXPANDED, true));
                }
            });
        },

        /** Generic event listener for DOM events listed in the {{#crossLink "_domEvents"}}{{/crossLink}} array.
         *  It will locate the iNode represented by the UI elements that received the event,
         *  slide a suitable instance on it and fire the same event on that node.
         *  @method _afterEvent
         *  @param ev {EventFacade} Event facade as produced by the event
         *  @private
         */
        _afterDomEvent: function(ev) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_afterDomEvent", 272);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 273);
var fwNode =  ev.node;
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 274);
if (fwNode) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 275);
fwNode.fire(ev.type.split(':')[1], {domEvent:ev.domEvent});
            }
        },
        /**
         * Returns a string identifying the type of the object to handle the iNode
         * or null if type was not a FlyweightNode instance.
         * @method _getTypeString
         * @param iNode {Object} Internal node in the tree configuration
         * @return {String} type of iNode.
         * @private
         */
        _getTypeString: function (iNode) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_getTypeString", 286);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 287);
var type = iNode.type || DEFAULT_POOL;
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 288);
if (!Lang.isString(type)) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 289);
if (Lang.isObject(type)) {
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 290);
type = type.NAME;
                } else {
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 292);
throw "Node contains unknown type";
                }
            }
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 295);
return type;
        },
        /**
         * Pulls from the pool an instance of the type declared in the given iNode
         * and slides it over that iNode.
         * If there are no instances of the given type in the pool, a new one will be created via {{#crossLink "_createNode"}}{{/crossLink}}
         * If an instance is held (see: {{#crossLink "FlyweightTreeNode/hold"}}{{/crossLink}}), it will be returned instead.
         * @method _poolFetch
         * @param iNode {Object} reference to a iNode within the configuration tree
         * @return {FlyweightTreeNode} Usually a subclass of FlyweightTreeNode positioned over the given iNode
         * @protected
         */
        _poolFetch: function(iNode) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_poolFetch", 307);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 308);
var pool,
                fwNode = iNode._held,
                type = this._getTypeString(iNode);

            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 312);
if (fwNode) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 313);
return fwNode;
            }
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 315);
pool = this._pool[type];
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 316);
if (pool === undefined) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 317);
pool = this._pool[type] = [];
            }
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 319);
if (pool.length) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 320);
fwNode = pool.pop();
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 321);
fwNode._slideTo(iNode);
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 322);
return fwNode;
            }
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 324);
return this._createNode(iNode);
        },
        /**
         * Returns the FlyweightTreeNode instance to the pool.
         * Instances held (see: {{#crossLink "FlyweightTreeNode/hold"}}{{/crossLink}}) are never returned.
         * @method _poolReturn
         * @param fwNode {FlyweightTreeNode} Instance to return.
         * @protected
         */
        _poolReturn: function (fwNode) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_poolReturn", 333);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 334);
if (fwNode._iNode._held) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 335);
return;
            }
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 337);
var pool,
                type = this._getTypeString(fwNode._iNode);
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 339);
pool = this._pool[type];
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 340);
if (pool) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 341);
pool.push(fwNode);
            }

        },
        /**
         * Returns a new instance of the type given in iNode or the
         * {{#crossLink "defaultType"}}{{/crossLink}} if none specified
         * and slides it on top of the iNode provided.
         * @method _createNode
         * @param iNode {Object} reference to a iNode within the configuration tree
         * @return {FlyweightTreeNode} Instance of the corresponding subclass of FlyweightTreeNode
         * @protected
         */
        _createNode: function (iNode) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_createNode", 354);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 355);
var newNode,
                Type = iNode.type || this.get('defaultType');
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 357);
if (Lang.isString(Type)) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 358);
Type = Y[Type];
            }
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 360);
if (Type) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 361);
newNode = new Type({root:this});
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 362);
if (newNode instanceof Y.FlyweightTreeNode) {
                    // I need to do this otherwise Attribute will initialize
                    // the real iNode with default values when activating a lazyAdd attribute.
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 365);
newNode._slideTo({});
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 366);
YArray.each(Y.Object.keys(newNode._state.data), newNode._addLazyAttr, newNode);
                    // newNode.getAttrs();
                    // That's it (see above)
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 369);
newNode._root =  this;
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 370);
newNode._slideTo(iNode);
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 371);
return newNode;
                }
            }
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 374);
return null;
        },
        /**
         * Returns an instance of Flyweight node positioned over the root
         * @method getRoot
         * @return {FlyweightTreeNode}
         */
        getRoot: function () {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "getRoot", 381);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 382);
return this._poolFetch(this._tree);
        },
        /**
         * Returns a string with the markup for the whole tree.
         * A subclass might opt to produce markup for those parts visible. (lazy rendering)
         * @method _getHTML
         * @return {String} HTML for this widget
         * @protected
         */
        _getHTML: function () {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_getHTML", 391);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 392);
var s = '',
                root = this.getRoot();
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 394);
root.forSomeChildren( function (fwNode, index, array) {
                _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 7)", 394);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 395);
s += fwNode._getHTML(index, array.length, 0);
            });
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 397);
this._poolReturn(root);
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 398);
return s;
        },
        /**
         * Locates a iNode in the tree by the element that represents it.
         * @method _findINodeByElement
         * @param el {Node} Any element belonging to the tree
         * @return {Object} iNode that produced the markup for that element or null if not found
         * @protected
         */
        _findINodeByElement: function(el) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_findINodeByElement", 407);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 408);
var id = el.ancestor(DOT + FWNode.CNAME_NODE, true).get('id'),
                found = null,
                scan = function (iNode) {
                    _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "scan", 410);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 411);
if (iNode.id === id) {
                        _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 412);
found = iNode;
                        _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 413);
return true;
                    }
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 415);
if (iNode.children) {
                        _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 416);
return YArray.some(iNode.children, scan);
                    }
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 418);
return false;
                };
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 420);
if (scan(this._tree)) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 421);
return found;
            }
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 423);
return null;
        },
        /**
         * Returns a FlyweightTreeNode instance from the pool, positioned over the iNode whose markup generated some event.
         * @method _poolFetchFromEvent
         * @param ev {EventFacade}
         * @return {FlyweightTreeNode} The FlyweightTreeNode instance or null if not found.
         * @private
         */
        _poolFetchFromEvent: function (ev) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_poolFetchFromEvent", 432);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 433);
var found = this._findINodeByElement(ev.domEvent.target);
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 434);
if (found) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 435);
return this._poolFetch(found);
            }
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 437);
return null;
        },
        /**
         * Traverses the whole configuration tree, calling a given function for each iNode.
         * If the function returns true, the traversing will terminate.
         * @method _forSomeINode
         * @param fn {Function} Function to call on each configuration iNode
         *		@param fn.iNode {Object} iNode in the configuration tree
         *		@param fn.depth {Integer} depth of this iNode within the tree
         *		@param fn.index {Integer} index of this iNode within the array of its siblings
         * @param scope {Object} scope to run the function in, defaults to `this`.
         * @return true if any of the function calls returned true (the traversal was terminated earlier)
         * @protected
         */
        _forSomeINode: function(fn, scope) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_forSomeINode", 451);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 452);
scope = scope || this;
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 453);
var loop = function(iNode, depth) {
                _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "loop", 453);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 454);
return YArray.some(iNode.children || [], function(childINode, index) {
                    _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 8)", 454);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 455);
if (fn.call(scope, childINode,depth, index)) {
                        _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 456);
return true;
                    }
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 458);
return loop(childINode,depth + 1);
                });
            };
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 461);
return loop(this._tree, 0);
        },
        /**
         * Executes the given function over all the nodes in the tree or until the function returns true.
         * If dynamic loading is enabled, it will not run over nodes not yet loaded.
         * @method forSomeNodes
         * @param fn {function} function to execute on each node.  It will receive:
         *	@param fn.node {FlyweightTreeNode} node being visited.
         *	@param fn.depth {Integer} depth from the root. The root node is level zero and it is not traversed.
         *	@param fn.index {Integer} position of this node within its branch
         *	@param fn.array {Array} array containing itself and its siblings
         * @param scope {Object} Scope to run the function in.  Defaults to the FlyweightTreeManager instance.
         * @return {Boolean} true if any function calls returned true (the traversal was interrupted)
         */
        forSomeNodes: function (fn, scope) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "forSomeNodes", 475);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 476);
scope = scope || this;

            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 478);
var forOneLevel = function (fwNode, depth) {
                _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "forOneLevel", 478);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 479);
fwNode.forSomeChildren(function (fwNode, index, array) {
                    _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 9)", 479);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 480);
if (fn.call(scope, fwNode, depth, index, array) === true) {
                        _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 481);
return true;
                    }
                    _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 483);
return forOneLevel(fwNode, depth+1);
                });
            };
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 486);
return forOneLevel(this.getRoot(), 1);
        },
        /**
         * Getter for the {{#crossLink "focusedNode:attribute"}}{{/crossLink}} attribute
         * @method _focusedNodeGetter
         * @return {FlyweightNode} Node that would have the focus if the widget is focused
         * @private
         */
        _focusedNodeGetter: function () {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_focusedNodeGetter", 494);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 495);
return this._poolFetch(this._focusedINode);
        },
        /**
         * Setter for the {{#crossLink "focusedNode:attribute"}}{{/crossLink}} attribute
         * @method _focusedNodeSetter
         * @param value {FlyweightNode} Node to receive the focus.
         * @return {Object} iNode matching the focused node.
         * @private
         */
        _focusedNodeSetter: function (value) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_focusedNodeSetter", 504);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 505);
if (!value || value instanceof Y.FlyweightTreeNode) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 506);
var newINode = (value?value._iNode:this._tree.children[0]);
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 507);
this._focusOnINode(newINode);
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 508);
return newINode;
            } else {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 510);
return Y.Attribute.INVALID_VALUE;
            }
        },
        /**
         * Sets the focus on the given iNode
         * @method _focusOnINode
         * @param iNode {Object} iNode to receive the focus
         * @private
         */
        _focusOnINode: function (iNode) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_focusOnINode", 519);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 520);
var prevINode = this._focusedINode,
                el;

            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 523);
if (iNode && iNode !== prevINode) {

                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 525);
el = Y.one('#' + prevINode.id + ' .' + CNAME_CONTENT);
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 526);
el.blur();
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 527);
el.set(TABINDEX, -1);

                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 529);
el = Y.one('#' + iNode.id + ' .' + CNAME_CONTENT);
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 530);
el.focus();
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 531);
el.set(TABINDEX,0);

                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 533);
this._focusedINode = iNode;
            }

        },
        /**
         * Setter for the {{#crossLink "dynamicLoader:attribute"}}{{/crossLink}} attribute.
         * It changes the expanded attribute to false on childless iNodes not marked with `isLeaf
         * since they can now be expanded.
         * @method
         * @param value {Function | null } Function to handle the loading of nodes on demand
         * @return {Function | null | INVALID_VALUE} function set or rejection
         * @private
         */
        _dynamicLoaderSetter: function (value) {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_dynamicLoaderSetter", 546);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 547);
if (!Lang.isFunction(value) &&  value !== null) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 548);
return Y.Attribute.INVALID_VALUE;
            }
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 550);
if (value) {
                _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 551);
this._forSomeINode(function(iNode) {
                    _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 10)", 551);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 552);
if (!iNode.children) {
                        _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 553);
iNode.expanded = !!iNode.isLeaf;
                    }
                });
            }
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 557);
return value;
        }
    },
    {
        ATTRS: {
            /**
             * Default object type of the nodes if no explicit type is given in the configuration tree.
             * It can be specified as an object reference, these two are equivalent: `Y.FWTreeNode` or  `'FWTreeNode'`.
             *
             * @attribute defaultType
             * @type {String | Object}
             * @default 'FlyweightTreeNode'
             */
            defaultType: {
                value: 'FlyweightTreeNode'
            },
            /**
             * Function used to load the nodes dynamically.
             * Function will run in the scope of the FlyweightTreeManager instance and will
             * receive:
             *
             * * node {FlyweightTreeNode} reference to the parent of the children to be loaded.
             * * callback {Function} function to call with the configuration info for the children.
             *
             * The function shall fetch the nodes and create a configuration object
             * much like the one a whole tree might receive.
             * It is not limited to just one level of nodes, it might contain children elements as well.
             * When the data is processed, it should call the callback with the configuration object.
             * The function is responsible of handling any errors.
             * If the the callback is called with no arguments, the parent node will be marked as having no children.
             *
             * This attribute should be set before the tree is rendered as childless nodes
             * render differently when there is a dynamic loader than when there isn't.
             * (childless nodes can be expanded when a dynamic loader is present and the UI should reflect that).
             * @attribute dynamicLoader
             * @type {Function or null}
             * @default null
             */
            dynamicLoader: {
                value: null,
                setter: '_dynamicLoaderSetter'
            },
            /**
             * Points to the node that currently has the focus.
             * If read, please make sure to release the node instance to the pool when done.
             * @attribute focusedNode
             * @type FlyweightTreeNode
             * @default First node in the tree
             */
            focusedNode: {
                getter: '_focusedNodeGetter',
                setter: '_focusedNodeSetter'
                // There is no need for validator since the setter already takes care of validation.
            }

        }
    });


_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 616);
Y.FlyweightTreeManager = FWMgr;
/**
* An implementation of the flyweight pattern.
* This object can be slid on top of a literal object containing the definition
* of a tree and will take its state from that iNode it is slid upon.
* It relies for most of its functionality on the flyweight manager object,
* which contains most of the code.
* @module gallery-flyweight-tree
*/

/**
* An implementation of the flyweight pattern.  This class should not be instantiated directly.
* Instances of this class can be requested from the flyweight manager class
* @class FlyweightTreeNode
* @extends Base
* @constructor  Do not instantiate directly.
*/
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 633);
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
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "initializer", 659);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 660);
this._root = cfg.root;
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
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_getHTML", 677);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 679);
var root = this._root,
                iNode = this._iNode,
				attrs = this.getAttrs(),
				s = '',
				templ = iNode.template,
				childCount = iNode.children && iNode.children.length,
				nodeClasses = [CNAME_NODE],
				superConstructor = this.constructor;

			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 688);
while (!templ) {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 689);
templ = superConstructor.TEMPLATE;
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 690);
superConstructor = superConstructor.superclass.constructor;

			}

			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 694);
iNode._rendered = true;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 695);
if (childCount) {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 696);
if (attrs.expanded) {
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 697);
iNode._childrenRendered = true;
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 698);
this.forSomeChildren( function (fwNode, index, array) {
						_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 11)", 698);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 699);
s += fwNode._getHTML(index, array.length, depth + 1);
					});
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 701);
nodeClasses.push(CNAME_EXPANDED);
				} else {
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 703);
nodeClasses.push(CNAME_COLLAPSED);
				}
			} else {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 706);
if (this._root.get(DYNAMIC_LOADER) && !iNode.isLeaf) {
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 707);
nodeClasses.push(CNAME_COLLAPSED);
				} else {
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 709);
nodeClasses.push(CNAME_NOCHILDREN);
				}
			}
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 712);
if (index === 0) {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 713);
nodeClasses.push(CNAME_FIRSTCHILD);
			}
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 715);
if (index === nSiblings - 1) {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 716);
nodeClasses.push(CNAME_LASTCHILD);
			}
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 718);
attrs.children = s;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 719);
attrs.cname_node = nodeClasses.join(' ');
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 720);
attrs.cname_content = CNAME_CONTENT;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 721);
attrs.cname_children = CNAME_CHILDREN;
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 722);
attrs.tabIndex = (iNode === root._focusedINode)?0:-1;

			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 724);
return Lang.sub(templ, attrs);

		},
		/**
		 * Method to slide this instance on top of another iNode in the configuration object
		 * @method _slideTo
		 * @param iNode {Object} iNode in the underlying configuration tree to slide this object on top of.
		 * @private
		 */
		_slideTo: function (iNode) {
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_slideTo", 733);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 734);
this._iNode = iNode;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 735);
this._stateProxy = iNode;
		},
		/**
		 * Executes the given function on each of the child nodes of this node.
		 * @method forSomeChildren
		 * @param fn {Function} Function to be executed on each node
		 *		@param fn.child {FlyweightTreeNode} Instance of a suitable subclass of FlyweightTreeNode,
		 *		positioned on top of the child node
		 *		@param fn.index {Integer} Index of this child within the array of children
		 *		@param fn.array {Array} array containing itself and its siblings
		 * @param scope {object} The falue of this for the function.  Defaults to the parent.
		**/
		forSomeChildren: function(fn, scope) {
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "forSomeChildren", 747);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 748);
var root = this._root,
				children = this._iNode.children,
				child, ret;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 751);
scope = scope || this;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 752);
if (children && children.length) {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 753);
YArray.some(children, function (iNode, index, array) {
					_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 12)", 753);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 754);
child = root._poolFetch(iNode);
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 755);
ret = fn.call(scope, child, index, array);
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 756);
root._poolReturn(child);
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 757);
return ret;
				});
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
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_expandedGetter", 771);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 772);
return this._iNode.expanded !== false;
		},
		/**
		 * Setter for the expanded configuration attribute.
		 * It renders the child nodes if this branch has never been expanded.
		 * Then sets the className on the node to the static constants
		 * CNAME_COLLAPSED or CNAME_EXPANDED from Y.FlyweightTreeManager
		 * @method _expandedSetter
		 * @param value {Boolean} new value for the expanded attribute
		 * @private
		 */
		_expandedSetter: function (value) {
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_expandedSetter", 783);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 784);
var self = this,
				iNode = self._iNode,
				root = self._root,
				el = Y.one('#' + iNode.id),
				dynLoader = root.get(DYNAMIC_LOADER);

			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 790);
iNode.expanded = value = !!value;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 791);
if (dynLoader && !iNode.isLeaf && (!iNode.children  || !iNode.children.length)) {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 792);
this._loadDynamic();
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 793);
return;
			}
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 795);
if (iNode.children && iNode.children.length) {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 796);
if (value) {
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 797);
if (!iNode._childrenRendered) {
						_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 798);
self._renderChildren();
					}
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 800);
el.replaceClass(CNAME_COLLAPSED, CNAME_EXPANDED);
				} else {
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 802);
el.replaceClass(CNAME_EXPANDED, CNAME_COLLAPSED);
				}
			}
            _yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 805);
el.set('aria-expanded', String(value));
		},
		/**
		 * Triggers the dynamic loading of children for this node.
		 * @method _loadDynamic
		 * @private
		 */
		_loadDynamic: function () {
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_loadDynamic", 812);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 813);
var self = this,
				root = self._root;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 815);
Y.one('#' + this.get('id')).replaceClass(CNAME_COLLAPSED, CNAME_LOADING);
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 816);
root.get(DYNAMIC_LOADER).call(root, self, Y.bind(self._dynamicLoadReturn, self));

		},
		/**
		 * Callback for the dynamicLoader method.
		 * @method _dynamicLoadReturn
		 * @param response {Array} array of child iNodes
		 * @private
		 */
		_dynamicLoadReturn: function (response) {
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_dynamicLoadReturn", 825);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 826);
var self = this,
				iNode = self._iNode,
				root = self._root;

			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 830);
if (response) {

				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 832);
iNode.children = response;
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 833);
root._initNodes(iNode);
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 834);
self._renderChildren();
			} else {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 836);
iNode.isLeaf = true;
			}
			// isLeaf might have been set in the response, not just in the line above.
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 839);
Y.one('#' + iNode.id).replaceClass(CNAME_LOADING, (iNode.isLeaf?CNAME_NOCHILDREN:CNAME_EXPANDED));
		},
		/**
		 * Renders the children of this node.
		 * It the children had been rendered, they will be replaced.
		 * @method _renderChildren
		 * @private
		 */
		_renderChildren: function () {
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_renderChildren", 847);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 848);
var s = '',
				iNode = this._iNode,
				depth = this.get('depth');
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 851);
iNode._childrenRendered = true;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 852);
this.forSomeChildren(function (fwNode, index, array) {
				_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 13)", 852);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 853);
s += fwNode._getHTML(index, array.length, depth + 1);
			});
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 855);
Y.one('#' + iNode.id + ' .' + CNAME_CHILDREN).setContent(s);
		},
		/**
		 * Prevents this instance from being returned to the pool and reused.
		 * Remember to {{#crossLink "release"}}{{/crossLink}} this instance when no longer needed.
		 * @method hold
		 * @chainable
		 */
		hold: function () {
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "hold", 863);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 864);
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
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "release", 873);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 874);
this._iNode._held = null;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 875);
this._root._poolReturn(this);
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 876);
return this;
		},
		/**
		 * Returns the parent node for this node or null if none exists.
		 * The copy is not on {{#crossLink "hold"}}{{/crossLink}}.
		 * Remember to release the copy to the pool when done.
		 * @method getParent
		 * @return FlyweightTreeNode
		 */
		getParent: function() {
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "getParent", 885);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 886);
var iNode = this._iNode._parent;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 887);
return (iNode?this._root._poolFetch(iNode):null);
		},
		/**
		 * Returns the next sibling node for this node or null if none exists.
		 * The copy is not on {{#crossLink "hold"}}{{/crossLink}}.
		 * Remember to release the copy to the pool when done.
		 * @method getNextSibling
		 * @return FlyweightTreeNode
		 */
		getNextSibling: function() {
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "getNextSibling", 896);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 897);
var parent = this._iNode._parent,
				siblings = (parent && parent.children) || [],
				index = siblings.indexOf(this) + 1;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 900);
if (index === 0 || index > siblings.length) {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 901);
return null;
			}
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 903);
return this._root._poolFetch(siblings[index]);
		},
		/**
		 * Returns the previous sibling node for this node or null if none exists.
		 * The copy is not on {{#crossLink "hold"}}{{/crossLink}}.
		 * Remember to release the copy to the pool when done.
		 * @method getPreviousSibling
		 * @return FlyweightTreeNode
		 */
		getPreviousSibling: function() {
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "getPreviousSibling", 912);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 913);
var parent = this._iNode._parent,
				siblings = (parent && parent.children) || [],
				index = siblings.indexOf(this) - 1;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 916);
if (index < 0) {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 917);
return null;
			}
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 919);
return this._root._poolFetch(siblings[index]);
		},
        /**
         * Sets the focus to this node.
         * @method focus
         * @chainable
         */
        focus: function() {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "focus", 926);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 927);
return this._root.set(FOCUSED, this);
        },
        /**
         * Removes the focus from this node
         * @method blur
         * @chainable
         */
        blur: function () {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "blur", 934);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 935);
return this._root.set(FOCUSED, null);
        },
		/**
		 * Sugar method to toggle the expanded state of the node.
		 * @method toggle
		 * @chainable
		 */
		toggle: function() {
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "toggle", 942);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 943);
return this.set(EXPANDED, !this.get(EXPANDED));
		},
        /**
         * Sugar method to expand a node
         * @method expand
         * @chainable
         */
        expand: function() {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "expand", 950);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 951);
return this.set(EXPANDED, true);
        },
        /**
         * Sugar method to collapse this node
         * @method collapse
         * @chainable
         */
        collapse: function() {
            _yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "collapse", 958);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 959);
return this.set(EXPANDED, false);
        },
		/**
		 * Returns true if this node is the root node
		 * @method isRoot
		 * @return {Boolean} true if root node
		 */
		isRoot: function() {
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "isRoot", 966);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 967);
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
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_getStateVal", 978);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 979);
var iNode = this._iNode;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 980);
if (this._state.get(name, BYPASS_PROXY) || !iNode) {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 981);
return this._state.get(name, VALUE);
			}
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 983);
if (iNode.hasOwnProperty(name)) {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 984);
return iNode[name];
			}
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 986);
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
			_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_setStateVal", 998);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 999);
var iNode = this._iNode;
			_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 1000);
if (this._state.get(name, BYPASS_PROXY) || this._state.get(name, 'initializing') || !iNode) {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 1001);
this._state.add(name, VALUE, value);
			} else {
				_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 1003);
iNode[name] = value;
			}
		}
	},
	{
		/**
		 * Template string to be used to render this node.
		 * It should be overriden by the subclass.
		 *
		 * It contains the HTML markup for this node plus placeholders,
		 * enclosed in curly braces, that have access to any of the
		 * configuration attributes of this node plus several predefined placeholders.
         *
         * It must contain at least three elements identified by their classNames:

         +----------------------------+
         | {cname_node}               |
         | +------------------------+ |
         | | {cname_content}        | |
         | +------------------------+ |
         |                            |
         | +------------------------+ |
         | | {cname_children}       | |
         | +------------------------+ |
         +----------------------------+

         * For example:

         '<div id="{id}" class="{cname_node}" role="" aria-expanded="{expanded}">' +
               '<div tabIndex="{tabIndex}" class="{cname_content}">{label}</div>' +
               '<div class="{cname_children}" role="group">{children}</div>' +
         '</div>'

         * The outermost container identified by the className `{cname_node}`
         * must also use the `{id}` placeholder to set the `id` of the node.
         * It should also have the proper ARIA role assigned and the
         * `aria-expanded` set to the `{expanded}` placeholder.
         *
         * It must contain two further elements:
         *
         * * A container for the contents of this node, identified by the className
         *   `{cname_content}` which should contain everything the user would associate
         *   with this node, such as the label and other status indicators
         *   such as toggle and selection indicators.
         *   This is the element that would receive the focus of the node, thus,
         *   it must have a `{tabIndex}` placeholder to receive the appropriate
         *   value for the `tabIndex` attribute.
         *
         * * The other element is the container for the children of this node.
         *   It will be identified by the className `{cname_children}` and it
         *   should enclose the placeholder `{children}`.
         *
		 * @property TEMPLATE
		 * @type {String}
		 * @default '<div id="{id}" class="{cname_node}" role="" aria-expanded="{expanded}"><div tabIndex="{tabIndex}"
         class="{cname_content}">{label}</div><div class="{cname_children}" role="group">{children}</div></div>'
		 * @static
		 */
		TEMPLATE: '<div id="{id}" class="{cname_node}" role="" aria-expanded="{expanded}">' +
                        '<div tabIndex="{tabIndex}" class="{cname_content}">{label}</div>' +
                        '<div class="{cname_children}" role="group">{children}</div>' +
                   '</div>',
		/**
		 * CCS className constant to use as the class name for the DOM element representing the node.
		 * @property CNAME_NODE
		 * @type String
		 * @static
		 */
		CNAME_NODE: CNAME_NODE,
		/**
		 * CCS className constant to use as the class name for the DOM element that will contain the label and/or status of this node.
		 * @property CNAME_CONTENT
		 * @type String
		 * @static
		 */
		CNAME_CONTENT: CNAME_CONTENT,
		/**
		 * CCS className constant to use as the class name for the DOM element that will contain the children of this node.
		 * @property CNAME_CHILDREN
		 * @type String
		 * @static
		 */
		CNAME_CHILDREN: CNAME_CHILDREN,
		/**
		 * CCS className constant added to the DOM element for this node when its state is not expanded.
		 * @property CNAME_COLLAPSED
		 * @type String
		 * @static
		 */
		CNAME_COLLAPSED: CNAME_COLLAPSED,
		/**
		 * CCS className constant added to the DOM element for this node when its state is expanded.
		 * @property CNAME_EXPANDED
		 * @type String
		 * @static
		 */
		CNAME_EXPANDED: CNAME_EXPANDED,
		/**
		 * CCS className constant added to the DOM element for this node when it has no children.
		 * @property CNAME_NOCHILDREN
		 * @type String
		 * @static
		 */
		CNAME_NOCHILDREN: CNAME_NOCHILDREN,
		/**
		 * CCS className constant added to the DOM element for this node when it is the first in the group.
		 * @property CNAME_FIRSTCHILD
		 * @type String
		 * @static
		 */
		CNAME_FIRSTCHILD: CNAME_FIRSTCHILD,
		/**
		 * CCS className constant added to the DOM element for this node when it is the last in the group.
		 * @property CNAME_LASTCHILD
		 * @type String
		 * @static
		 */
		CNAME_LASTCHILD: CNAME_LASTCHILD,
		/**
		 * CCS className constant added to the DOM element for this node when dynamically loading its children.
		 * @property CNAME_LOADING
		 * @type String
		 * @static
		 */
		CNAME_LOADING: CNAME_LOADING,
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
					_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "getter", 1140);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 1141);
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
				validator: Lang.isString,
				value: ''
			},
			/**
			 * Id to assign to the DOM element that contains this node.
			 * If none was supplied, it will generate one
			 * @attribute id
			 * @type {Identifier}
			 * @default guid()
			 * @readOnly
			 */
			id: {
				readOnly: true
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
					_yuitest_coverfunc("build/gallery-flyweight-tree/gallery-flyweight-tree.js", "getter", 1188);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 1189);
var count = 0,
						iNode = this._iNode;
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 1191);
while (iNode._parent) {
						_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 1192);
count += 1;
						_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 1193);
iNode = iNode._parent;
					}
					_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 1195);
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
				_bypassProxy: true,
				getter: '_expandedGetter',
				setter: '_expandedSetter'
			}
		}
	}
);
_yuitest_coverline("build/gallery-flyweight-tree/gallery-flyweight-tree.js", 1212);
Y.FlyweightTreeNode = FWNode;



}, '@VERSION@', {"requires": ["widget", "base-build"], "skinnable": false});
