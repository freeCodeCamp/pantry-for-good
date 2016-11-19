'use strict';

// Configuring the Volunteer module
angular.module('volunteer').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Volunteer Database', 'admin/volunteers', 'item', 'root.listVolunteers', '', ['admin'], 5);

		// Set sidebar menu items for volunteers
		Menus.addMenuItem('volunteer', 'Edit Application', '/edit', 'item', 'root.editVolunteerUser({volunteerId: sidebarCtrl.user._id})', '', ['volunteer'], 0);
	}
]);
