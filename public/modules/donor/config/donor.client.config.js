'use strict';

// Configuring the Donor module
angular.module('donor').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Donor Database and Tax Receipts', 'admin/donors', 'item', 'root.listDonors', '', ['admin'], 6);

		// Set sidebar menu items for donors
		Menus.addMenuItem('donor', 'Edit Application', '/edit', 'item', 'root.editDonorUser({donorId: $ctrl.user._id})', '', ['donor'], 0);
	}
]);
