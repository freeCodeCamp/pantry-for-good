(function() {
	'use strict';

	angular.module('customer').controller('CustomerAdminController', CustomerAdminController);

	/* @ngInject */
	function CustomerAdminController($window, $stateParams, $state, Authentication, CustomerAdmin, Food) {
		var self = this,
				user = Authentication.user;

		// This provides Authentication context
		self.authentication = Authentication;

		// Verify is user has admin role, redirect to home otherwise
		if (user && user.roles.indexOf('admin') < 0) $state.go('root');

		self.customer = self.customer || {};

		// Add plugins into datatable
		self.dtOptions = {
			dom: 'TCRlfrtip',
			tableTools: {
        sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
				aButtons: ['copy', 'xls']
			}
		};

		/**
		 *	Food Preferences
		 */

		// Store selected food categories
		self.foodList = self.foodList || [];

		// Initialize food preferences
		self.customer.foodPreferences = self.customer.foodPreferences || [];

		// Find list of food items and flatten received objects
		self.findFood = function() {
			Food.query({}, function(foods) {
				foods.forEach(function(food) {
					self.foodList = self.foodList.concat(food.items);
				});
			});
		};

		// Toggle selection of all food items
		self.selectAll = function(checked) {
			if (!checked) {
				self.customer.foodPreferences = [];
				self.foodList.forEach(function(item) {
					self.customer.foodPreferences.push(item._id);
				});
			} else {
				self.customer.foodPreferences = [];
			}
		};

		// Check if food item is selected
		self.foodIsChecked = function(selectedFood) {
			if (self.customer.foodPreferences) {
				return self.customer.foodPreferences.indexOf(selectedFood._id) > -1;
			}
		};

		// Store food category when box is checked an remove when unchecked
		self.toggleSelection = function(selectedFood) {
			var index = self.customer.foodPreferences.indexOf(selectedFood._id);
			if (index > -1) {
				self.customer.foodPreferences.splice(index, 1);
			} else {
				self.customer.foodPreferences.push(selectedFood._id);
			}
		};

		/**
		 *	Dependants Section
		 */

		// Store dependants in the household
		self.customer.household = [{
			name: self.customer.firstName + ' ' + self.customer.lastName,
			relationship: 'Applicant',
			dateOfBirth: self.customer.dateOfBirth
		}];

		// Set an array of dependants based on input value
		self.setDependantList = function(numberOfDependants) {
			var temp = angular.copy(self.customer.household);
			self.customer.household = [];
			for (var i = numberOfDependants - 1; i >= 0; i--) {
				self.customer.household[i] = temp[i] || {};
			}
		};

		/**
		 * Helper Functions
		 */

		// Refactor food item objects into a list of names separated by comma's
		self.splitByComma = function(foodItems) {
			if (foodItems) {
				var temp = [];
				foodItems.forEach(function(itemId) {
					self.foodList.forEach(function(food) {
						if (itemId === food._id) temp.push(food.name);
					});
				});
				return temp.join(', ');
			}
		};

		// Add up totals in Financial Assessment
		self.total = function(data, type) {
			if (data) {
				return data.reduce(function(a, b) {
					return a + b[type];
				}, 0);
			}
		};

		/**
		 * CRUD Functions
		 */

		// Find a list of customers
		self.find = function() {
			self.customers = CustomerAdmin.query();
		};

		// Find existing customer
		self.findOne = function() {
			self.customer = CustomerAdmin.get({
				customerId: $stateParams.customerId
			}, function(customer){
				self.numberOfDependants = customer.household.length;
				self.setDependantList(self.numberOfDependants);
			});
		};

		// Update existing customer
		self.update = function(status) {
			var customer = self.customer;

			if (status) customer.status = status;

			customer.$update()
				.then(function() {
				// Redirect after update
				$state.go('root.listCustomers');
			})
			.catch(function(err) {
				if (err) {
					self.error = err.data.message;
				}
			});
		};

		// Delete existing customer
		self.delete = function(customer) {
			if ($window.confirm('Are you sure?')) {
				customer.$delete(function() {
					$state.go('root.listCustomers', null, { reload: true });
				}, function(errorResponse) {
					self.error = errorResponse.data.message;
				});
			}
		};
	}
})();
