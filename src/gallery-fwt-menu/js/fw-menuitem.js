/** This class must not be generated directly.  
 *  Instances of it will be provided by Y.FWMenu as required.
 *  
 *  Subclasses might be defined based on it.  
 *  Usually, they will add further attributes and redefine the TEMPLATE to 
 *  show those extra attributes.
 *  
 *  @module gallery-fwt-menu
 *    
 *  @class Y.FWMenuItem
 *  @extends Y.FlyweightTreeNode
 *  @constructor
 */
 Y.FWMenuItem = Y.Base.create(
	'fw-menuitem',
	Y.FlyweightTreeNode,
	[],
	{
		initializer: function() {
			this.after('click', this._afterClick, this);
		},
		/**
		 * Responds to the click event by toggling the node
		 * @method _afterClick
		 * @param ev {EventFacade}
		 * @private
		 */
		_afterClick: function (ev) {
			var target = ev.domEvent.target;
			if (target.hasClass(CNAMES.toggle)) {
				this.toggle();
			} else if ((target.hasClass(CNAMES.content) || target.hasClass(CNAMES.icon)) && this.get('root').get('toggleOnLabelClick')) {
				this.toggle();
			} else if (target.hasClass(CNAMES.selection)) {
				this.toggleSelection();
			}
		}
	},
	{
		/**
		 * Template to produce the markup for a node in the tree.
		 * @property TEMPLATE
		 * @type String
		 * @static
		 */
		TEMPLATE: Lang.sub('<li id="{id}" class="{cname_node}"><div class="{toggle}"></div><div class="{icon}"></div><div class="{selection}"></div><div class="{content}">{label}</div><ul class="{cname_children}">{children}</ul></li>', CNAMES)
	}
);

