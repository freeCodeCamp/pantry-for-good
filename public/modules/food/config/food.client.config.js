'use strict';

// Configuring the Food module
angular.module('food').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Inventory', 'admin/foods', 'item', 'root.foods', '', ['admin'], 3);
	}
]);
