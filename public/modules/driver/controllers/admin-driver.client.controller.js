(function() {
	'use strict';

	angular.module('driver').controller('DriverAdminController', ListDriversController);

	/* @ngInject */
	function ListDriversController(VolunteerAdmin, moment) {
		var self = this;

		//=== Bindable variables ===//
		self.drivers = {};
		self.driversCopy = [].concat(self.drivers); // Copy data for smart table
		self.isLoading = true;

		//=== Private variables ===//
		moment = moment.utc;
		var beginWeek = moment().startOf('isoWeek'); // Store the date of this week's Monday

		findDrivers();

		function findDrivers() {
			// Set loading state
			self.isLoading = true;

			VolunteerAdmin.query({}, function(volunteers) {
				self.drivers = volunteers.filter(function(volunteer) {
					return volunteer.driver;
				}).map(function(driver) {
					driver.deliveryStatus = driver.customers.every(function(customer) {
						return moment(customer.lastDelivered).isSame(beginWeek);
					});
					driver.deliveryStatus = driver.deliveryStatus ? 'In progress' : 'Completed';
					return driver;
				});

				// Remove loading state
				self.isLoading = false;
			});
		}
	}
})();
