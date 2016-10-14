'use strict';

// Configuring the Settings module
angular.module('settings').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'App Settings', 'settings', 'item', 'root.changeSettings', '', ['admin'], 7);
	}
]);
