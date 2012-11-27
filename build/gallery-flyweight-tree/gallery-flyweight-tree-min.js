YUI.add("gallery-flyweight-tree",function(e,t){"use strict";var n=e.Lang,r=e.Array,i=".",s="_bypassProxy",o="contentBox",u="value",a="expanded",f="dynamicLoader",l="tabIndex",c="focused",h="_default",p=e.ClassNameManager.getClassName,d="flyweight-tree-node",v=function(e){return p(d,e)},m,g;m=e.Base.create(t,e.Widget,[],{_tree:null,_pool:null,_domEvents:null,_focusedINode:null,_eventHandles:null,initializer:function(){this._pool={},this._eventHandles=[]},destructor:function(){r.each(this._pool,function(e){e.destroy()}),this._pool=null,r.each(this._eventHandles,function(e){e.detach()}),this._eventHandles=null},_loadConfig:function(t){this._tree={children:e.clone(t)},this._initNodes(this._tree)},_initNodes:function(t){var i=this,s=!!i.get(f);r.each(t.children,function(r,o){n.isString(r)&&(r={label:r},t.children[o]=r),i._focusedINode||(i._focusedINode=r),r._parent=t,r.id=r.id||e.guid(),s&&!r.children?r.expanded=!!r.isLeaf:r.expanded=r.expanded===undefined||!!r.expanded,i._initNodes(r)})},renderUI:function(){var e=this.getRoot();e._renderChildren(this.get(o)),e.release()},bindUI:function(){var e=this;e._eventHandles.push(e.after("focus",e._afterFocus)),e._domEvents&&r.each(e._domEvents,function(t){e._eventHandles.push(e.after(t,e._afterDomEvent,e))})},fire:function(e,t){var n,r=this;return t&&t.domEvent?(t.node=r._poolFetchFromEvent(t),n=m.superclass.fire.call(r,e,t),r._poolReturn(t.node),n):m.superclass.fire.apply(r,arguments)},expandAll:function(){this._forSomeINode(function(e){e.children&&!e.expanded&&this._poolReturn(this._poolFetch(e).set(a,!0))})},collapseAll:function(){this._forSomeINode(function(e){e.children&&e.expanded&&this._poolReturn(this._poolFetch(e).set(a,!1))})},getNodeBy:function(e,t){var r,i=null;if(n.isFunction(e))r=e;else{if(!n.isString(e))return null;r=function(n){return n.get(e)===t}}return this.forSomeNodes(function(e){return r(e)?(i=e,i.hold(),!0):!1}),i},_afterDomEvent:function(e){var t=e.node;t&&t.fire(e.type.split(":")[1],{domEvent:e.domEvent})},_getTypeString:function(e){var t=e.type||h;if(!n.isString(t)){if(!n.isObject(t))throw"Node contains unknown type";t=t.NAME}return t},_poolFetch:function(e){var t,n=e._held,r=this._getTypeString(e);return n?n:(t=this._pool[r],t===undefined&&(t=this._pool[r]=[]),t.length?(n=t.pop(),n._slideTo(e),n):this._createNode(e))},_poolReturn:function(e){if(e._iNode._held)return;var t,n=this._getTypeString(e._iNode);t=this._pool[n],t&&t.push(e)},_createNode:function(t){var i,s=t.type||this.get("defaultType");n.isString(s)&&(s=e[s]);if(s){i=new s({root:this});if(i instanceof e.FlyweightTreeNode)return i._slideTo({}),r.each(e.Object.keys(i._state.data),i._addLazyAttr,i),i._root=this,i._slideTo(t),i}return null},getRoot:function(){return this._poolFetch(this._tree).hold()},_findINodeByElement:function(e){var t=e.ancestor(i+g.CNAMES.CNAME_NODE,!0).get("id"),n=null,s=function(e){return e.id===t?(n=e,!0):e.children?r.some(e.children,s):!1};return s(this._tree)?n:null},_poolFetchFromEvent:function(e){var t=this._findINodeByElement(e.domEvent.target);return t?this._poolFetch(t):null},_forSomeINode:function(e,t){t=t||this;var n=function(i,s){return r.some(i.children||[],function(r,i){return e.call(t,r,s,i)?!0:n(r,s+1)})};return n(this._tree,0)},forSomeNodes:function(e,t){t=t||this;var n=this.getRoot(),r=function(n,i){n.forSomeChildren(function(n,s,o){return e.call(t,n,i,s,o)===!0?!0:r(n,i+1)})},i=r(n,1);return n.release(),i},_focusedNodeGetter:function(){return this._poolFetch(this._focusedINode).hold()},_focusedNodeSetter:function(t){if(!t||t instanceof e.FlyweightTreeNode){var n=t?t._iNode:this._tree.children[0];return this._focusOnINode(n),n}return e.Attribute.INVALID_VALUE},_focusOnINode:function(t){var n=this._focusedINode,r,i=this,s=function(e){e=e._parent,e&&e._parent&&(s(e),i._poolReturn(i._poolFetch(e).set("expanded",!0)))};t&&t!==n&&(r=e.one("#"+n.id+" ."+g.CNAMES.CNAME_CONTENT),r.blur(),r.set(l,-1),s(t),r=e.one("#"+t.id+" ."+g.CNAMES.CNAME_CONTENT),r.focus(),r.set(l,0),i._focusedINode=t)},_dynamicLoaderSetter:function(t){return!n.isFunction(t)&&t!==null?e.Attribute.INVALID_VALUE:(t&&this._forSomeINode(function(e){e.children||(e.expanded=!!e.isLeaf)}),t)}},{ATTRS:{defaultType:{value:"FlyweightTreeNode"},dynamicLoader:{value:null,setter:"_dynamicLoaderSetter"},focusedNode:{getter:"_focusedNodeGetter",setter:"_focusedNodeSetter"}}}),e.FlyweightTreeManager=m,g=e.Base.create(d,e.Base,[],{_iNode:null,_root:null,initializer:function(e){this._root=e.root,this.after("expandedChange",this._afterExpandedChange),this.after("labelChange",this._afterLabelChange)},_buildCfgPatch:function(){var t={},n,i,s=this.constructor;r.each(this._classes,function(r){e.mix(t,r.CNAMES),n=n||r.INNER_TEMPLATE,i=i||r.OUTER_TEMPLATE}),s.CNAMES=t,s.INNER_TEMPLATE=n,s.OUTER_TEMPLATE=i},_getHTML:function(t,r,i){var s=this._root,o=this._iNode,u=this.getAttrs(),a="",l=o.children&&o.children.length,c=this.constructor.CNAMES,h=[c.CNAME_NODE],p,d=o.inner_template||this.constructor.INNER_TEMPLATE,v=o.outer_template||this.constructor.OUTER_TEMPLATE;return p=v.replace("{INNER_TEMPLATE}",d),e.mix(u,c),o._rendered=!0,l?u.expanded?(o._childrenRendered=!0,this.forSomeChildren(function(e,t,n){a+=e._getHTML(t,n.length,i+1)}),h.push(c.CNAME_EXPANDED)):h.push(c.CNAME_COLLAPSED):this._root.get(f)&&!o.isLeaf?h.push(c.CNAME_COLLAPSED):h.push(c.CNAME_NOCHILDREN),t===0&&h.push(c.CNAME_FIRSTCHILD),t===r-1&&h.push(c.CNAME_LASTCHILD),o.type&&h.push(c.CNAME_TYPE_PREFIX+s._getTypeString(o)),u.children=a,u.CNAME_NODE=h.join(" "),u.tabIndex=o===s._focusedINode?0:-1,n.sub(p,u)},_slideTo:function(e){this._iNode=e,this._stateProxy=e},hasChildren:function(){var e=this._iNode.children;return!!e&&!!e.length},forSomeChildren:function(e,t){var n=this._root,i=this._iNode.children,s,o;t=t||this,i&&i.length&&r.some(i,function(r,i,u){return s=n._poolFetch(r),o=e.call(t,s,i,u),n._poolReturn(s),o})},_afterLabelChange:function(t){var n=e.one("#"+this._iNode.id+" ."+g.CNAMES.CNAME_CONTENT);n&&n.setHTML(t.newVal)},_expandedGetter:function(){return this._iNode.expanded!==!1},_afterExpandedChange:function(t){var n=!!t.newVal,r=this,i=r._iNode,s=r._root,o=e.one("#"+i.id),u=s.get(f),a=g.CNAMES.CNAME_EXPANDED,l=g.CNAMES.CNAME_COLLAPSED;i.expanded=n;if(u&&!i.isLeaf&&(!i.children||!i.children.length)){this._loadDynamic();return}o&&(i.children&&i.children.length&&(n?(i._childrenRendered||r._renderChildren(),o.replaceClass(l,a)):o.replaceClass(a,l)),o.set("aria-expanded",String(n)))},_loadDynamic:function(){var t=this,n=t._root;e.one("#"+this.get("id")).replaceClass(g.CNAMES.CNAME_COLLAPSED,g.CNAMES.CNAME_LOADING),n.get(f).call(n,t,e.bind(t._dynamicLoadReturn,t))},_dynamicLoadReturn:function(t){var n=this,r=n._iNode,i=n._root,s=g.CNAMES;t?(r.children=t,i._initNodes(r),n._renderChildren()):r.isLeaf=!0,e.one("#"+r.id).replaceClass(s.CNAME_LOADING,r.isLeaf?s.CNAME_NOCHILDREN:s.CNAME_EXPANDED)},_renderChildren:function(t){var n="",r=this._iNode,i=this.get("depth");r._childrenRendered=!0,this.forSomeChildren(function(e,t,r){n+=e._getHTML(t,r.length,i+1)}),t=t||e.one("#"+r.id+" ."+g.CNAMES.CNAME_CHILDREN),t.setHTML(n)},hold:function(){return this._iNode._held=this},release:function(){return this._iNode._held=null,this._root._poolReturn(this),this},getParent:function(){var e=this._iNode._parent;return e?this._root._poolFetch(e).hold():null},getNextSibling:function(){var e=this._iNode._parent,t=e&&e.children||[],n=t.indexOf(this._iNode)+1;return n===0||n>=t.length?null:this._root._poolFetch(t[n]).hold()},getPreviousSibling:function(){var e=this._iNode._parent,t=e&&e.children||[],n=t.indexOf(this._iNode)-1;return n<0?null:this._root._poolFetch(t[n]).hold()},focus:function(){return this._root.set(c,this)},blur:function(){return this._root.set(c,null)},toggle:function(){return this.set(a,!this.get(a))},expand:function(){return this.set(a,!0)},collapse:function(){return this.set(a,!1)},isRoot:function(){return this._root._tree===this._iNode},_getStateVal:function(e){var t=this._iNode;return this._state.get(e,s)||!t?this._state.get(e,u):t.hasOwnProperty(e)?t[e]:this._state.get(e,u)},_setStateVal:function(e,t){var n=this._iNode;this._state.get(e,s)||this._state.get(e,"initializing")||!n?this._state.add(e,u,t):n[e]=t}},{OUTER_TEMPLATE:'<div id="{id}" class="{CNAME_NODE}" role="" aria-expanded="{expanded}">{INNER_TEMPLATE}<div class="{CNAME_CHILDREN}" role="group">{children}</div></div>',INNER_TEMPLATE:'<div tabIndex="{tabIndex}" class="{CNAME_CONTENT}">{label}</div>',CNAMES:{CNAME_NODE:p(d),CNAME_CONTENT:v("content"),CNAME_CHILDREN:v("children"),CNAME_COLLAPSED:v("collapsed"),CNAME_EXPANDED:v(a),CNAME_NOCHILDREN:v("no-children"),CNAME_FIRSTCHILD:v("first-child"),CNAME_LASTCHILD:v("last-child"),CNAME_LOADING:v("loading"),CNAME_TYPE_PREFIX:v("type-")},ATTRS:{root:{_bypassProxy:!0,readOnly:!0,getter:function(){return this._root}},template:{validator:n.isString},label:{setter:String,value:""},id:{validator:function(){return!this.get("rendered")}},depth:{_bypassProxy:!0,readOnly:!0,getter:function(){var e=0,t=this._iNode;while(t._parent)e+=1,t=t._parent;return e-1}},expanded:{getter:"_expandedGetter"}}}),e.FlyweightTreeNode=g},"@VERSION@",{requires:["widget","base-build"],skinnable:!1});
