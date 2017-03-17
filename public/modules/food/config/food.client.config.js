'use strict';

// Configuring the Food module
angular.module('food').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Inventory', 'admin/foods', 'item', 'root.foodsAdmin', '', ['admin'], 3);
		Menus.addMenuItem('admin', 'Inventory(React)', 'admin/foods-react', 'item', 'root.foodsAdminReact', '', ['admin'], 3);
	}
]);
