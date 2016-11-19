(function() {
	'use strict';

	angular.module('driver').controller('DriverUserController', DriverUserController);

	/* @ngInject */
	function DriverUserController($filter, Authentication, VolunteerUser, CustomerAdmin, moment) {
		var self = this;

		var user = Authentication.user;

		//=== Bindable variables ===//
		self.allChecked = false;
		self.customers = {};
		self.customersCopy = [].concat(self.customers); // Copy data for smart table
		self.deliver = deliver;
		self.driver = {};
		self.error = {};
		self.isDisabled = isDisabled;
		self.isLoading = null;
		self.updateNotes = updateNotes;

		//=== Private variables ===//
		moment = moment.utc;
		var beginWeek = moment().startOf('isoWeek'); // Store the date of this week's Monday

		findCustomers();

		// Find a list of customers
		function findCustomers() {
			// Set loading state
			self.isLoading = true;
			VolunteerUser.get({
				volunteerId: user._id
			}, function(volunteer) {
				self.driver = volunteer;
				self.customers = volunteer.customers.filter(function(customer) {
					// Select only customers that have been packed but not delivered yet
					return moment(customer.lastPacked).isSame(beginWeek) &&
						!moment(customer.lastDelivered).isSame(beginWeek);
				});
				// Remove loading state
				self.isLoading = false;
			});
		}

		// Mark customers as delivered
		function deliver() {
			// Set loading state
			self.isLoading = true;
			// Keep track of server calls that haven't returned yet
			var updatesInProgress = 0;

			var driver = self.driver;

			self.customers.filter(function(customer) {
				return customer.isChecked;
			}).forEach(function(customerOld) {
				var customer = new CustomerAdmin(customerOld);

				// Update delivered date to this week
				customer.lastDelivered = beginWeek;
				// Add server call
				updatesInProgress++;

				customer.$update(function() {
					// Subtract server call upon return
					updatesInProgress--;
					// If all customers and driver updates have returned from the server then we can
					// render the view again
					// Note: This will trigger only once, depending on which callback comes in last,
					// which is why it's in both the customer and driver callbacks
					if (!updatesInProgress) findCustomers();
				}, function(errorResponse) {
					self.error = errorResponse.data.message;
				});
			});
		}

		// Update general notes
		function updateNotes() {
			// Set loading state
			self.isLoading = true;

			var driver = self.driver;
			driver.generalNotes = driver.newNotes;

			driver.$update(function() {
				findCustomers();
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		}

		//=== Helper functions ===//
		// Enable button if any of the checkboxes are checked
		function isDisabled() {
			if (self.customers) {
				return !$filter('filter')(self.customers, {isChecked: true}).length;
			}
		}

		// Select all checkboxes
		self.selectAll = function() {
			self.customers.forEach(function(customer) {
				customer.isChecked = !self.allChecked;
			});
		};
	}
})();
