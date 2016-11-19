'use strict';

// Configuring the Schedule module
angular.module('schedule').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Food Schedule', 'admin/schedules', 'item', 'root.schedules', '', ['admin'], 1);
	}
]);
