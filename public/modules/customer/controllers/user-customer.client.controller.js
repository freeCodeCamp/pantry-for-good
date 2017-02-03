(function() {
	'use strict';

	angular.module('customer').controller('CustomerUserController', CustomerUserController);

	/* @ngInject */
	function CustomerUserController($stateParams, $state, Authentication, CustomerUser, moment, Data, Form, SectionsAndFields) {
		var self = this,
				user = Authentication.user;

		// This provides Authentication context
		self.authentication = Authentication;

		// If user is not signed in redirect to signin
		if (!user) $state.go('root.signin');

		// Redirect to edit if user has already applied
		if (user && user.hasApplied && $state.is('root.createCustomerUser')) $state.go('root.editCustomerUser', { customerId: user._id });

		// Populate customer object if the user has filled an application
		self.customer = self.customer || {};
		angular.extend(self.customer, user);

		// Use SectionsAndFields service to load sections and fields from db, View service to create dynamic view from questionnaire editor
		SectionsAndFields.get().then(function(res) {
			self.dynForm = Form.generate(self.customer, res, 'qClients');
			self.sectionNames = Form.getSectionNames(res, 'qClients'); 
		});

		/**
		 *	Food Preferences
		 */

		// Store selected food categories
		self.foodList = self.foodList || [];

		// Initialize food preferences
		self.customer.foodPreferences = self.customer.foodPreferences || [];

		// Find list of food items and flatten received objects
		self.findFood = function() {
			CustomerUser.query({}, function(foods) {
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
		 *	 Financial Assessment
		 */

		self.customer.employment = self.customer.employment || {};
		self.customer.financialAssessment = self.customer.financialAssessment || {};
		self.customer.financialAssessment.income = self.customer.financialAssessment.income || Data.getIncomeList();
		self.customer.financialAssessment.expenses = self.customer.financialAssessment.expenses || Data.getExpensesList();

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
				self.customer.household[i].dateOfBirth =
					new Date(self.customer.household[i].dateOfBirth);
			}
		};

		/**
		 *	Helper Functions
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

		// Create a new customer
		self.create = function() {
			var customer = new CustomerUser(self.customer);
			delete customer._id;
			user.hasApplied = true;

			customer.$save(function() {
				// Redirect after save
				$state.go('root.createCustomerUser-success', null, { reload: true });
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Find existing customer
		self.findOne = function() {
			self.customer = CustomerUser.get({
				customerId: $stateParams.customerId
			}, function(customer){
				self.customer.dateOfBirth = new Date(customer.dateOfBirth);
				self.numberOfDependants = customer.household.length;
				self.setDependantList(self.numberOfDependants);
			});
		};

		// Update existing customer
		self.update = function() {
			var customer = self.customer;

			customer.$update(function() {
				// Redirect after update
				$state.go('root');
			})
			.catch(function(err) {
				if (err) {
					self.error = err.data.message;
				}
			});
		};
	}
})();
