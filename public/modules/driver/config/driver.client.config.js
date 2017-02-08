'use strict';

// Configuring the Driver menu
angular.module('driver').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Drivers and Route Assignment', 'admin/drivers', 'treeview', 'root.driver', '', ['admin'], 4);
		Menus.addSubMenuItem('admin', 'admin/drivers', 'Drivers', 'admin/drivers', 'root.driver.admin', '', ['admin'], 0);
		Menus.addSubMenuItem('admin', 'admin/drivers', 'Route Assignment', 'admin/drivers/routes', 'root.driver.routes', '', ['admin'], 1);

		// Set sidebar menu items for drivers
		Menus.addMenuItem('driver', 'Edit Application', '/edit', 'item', 'root.editVolunteerUser({volunteerId:sidebarCtrl.user._id})', '', ['driver'], 0);
		Menus.addMenuItem('driver', 'Route Assignment', 'driver/routes', 'item', 'root.driver.user', '', ['driver'], 1);
	}
]);
