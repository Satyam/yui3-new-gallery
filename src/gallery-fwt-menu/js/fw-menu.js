/** Creates a Meny using the FlyweightTreeManager extension to handle its nodes.
 * It creates the menu based on an object passed as the `menu` attribute in the constructor.
 * @example
 *
	var menu = new Y.FWMenu({menu: [
		{
			label:'File',
			children: [
				{label: 'Open'},
				{
					label: 'Export',
					children: [
						{label: 'PDF'},
						{label: 'HTML'}
					]
				}
			]
		},
		{label: 'Exit'}

	]});
	tv.render('#container');
 * @module gallery-fwt-menu
 * @class Y.FWMenu
 * @extends Y.Widget
 * @uses Y.FlyweightTreeManager
 * @constructor
 * @param config {Object} Configuration attributes, amongst them:
 * @param config.menu {Array} Array of objects defining the first level of menu items.
 * @param config.menu.label {String} Text or HTML markup to be shown in the menu item.
 * @param [config.menu.toggle=false] {Boolean} Whether the menu item is of the toggle type.
 * @param [config.menu.children] {Array} Further definitions for the children of this menu item.
 * @param [config.menu.type=Y.FWMenuItem] {Y.FWMenuItem | String} Class used to create instances for this menu item
 * It can be a reference to an object or a name that can be resolved as `Y[name]`.
 * @param [config.menu.id=Y.guid()] {String} Identifier to assign to the DOM element containing this menu item.
 * @param [config.menu.template] {String} Template for this particular menu item. 
 */
Y.FWMenu = Y.Base.create(
	'fw-menu',
	Y.Widget,
	[Y.FlyweightTreeManager],
	{
		/**
		 * Widget lifecycle method
		 * @method initializer
		 * @param config {object} configuration object of which 
		 * `tree` contains the tree configuration.
		 */
		initializer: function (config) {
			this._domEvents = ['click'];
			this._loadConfig(config.menu);
		},
		/**
		 * Widget lifecyle method
		 * I opted for not including this method in FlyweightTreeManager so that
		 * it can be used to extend Base, not just Widget
		 * @method renderUI
		 * @protected
		 */
		renderUI: function () {
			this.get(CBX).setContent(this._getHTML());
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
			 * so it creates FWMenuItem instances instead of the default.
			 * @attribute defaultType
			 * @type String
			 * @default 'FWMenuItem'
			 */
			defaultType: {
				value: 'FWMenuItem'
			}

		}

	}
);
