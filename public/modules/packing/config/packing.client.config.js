'use strict';

// Configuring the Packing module
angular.module('packing').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Packing List', 'admin/packing', 'item', 'root.packing', '', ['admin'], 2);
	}
]);
