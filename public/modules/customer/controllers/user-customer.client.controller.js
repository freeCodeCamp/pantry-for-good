// import '../services/customer.client.service';

(function() {
	'use strict';

	angular.module('customer').controller('CustomerUserController', CustomerUserController);

	/* @ngInject */
	function CustomerUserController($stateParams, $state, Authentication, CustomerUser, moment, Data, Form, formInit) {
		var self = this,
				user = Authentication.user;

		// This provides Authentication context
		self.authentication = Authentication;

		// Redirect to edit if user has already applied
		if (user && user.hasApplied && $state.is('root.createCustomerUser')) $state.go('root.editCustomerUser', { customerId: user._id });

		// Populate customer object if the user has filled an application
		self.dynType = self.dynType || {};
		angular.extend(self.dynType, user);

		// Use formInit service to load sections and fields from db, View service to create dynamic view from questionnaire editor
		self.dynMethods = Form.methods;
		formInit.get().then(function(res) {
			var init = self.dynMethods.generate(self.dynType, res, 'qClients');
			self.dynForm = init.dynForm;
			self.sectionNames = init.sectionNames;
			self.foodList = init.foodList;
		});

		/**
		 *	 Financial Assessment
		 */

		// self.dynType.employment = self.dynType.employment || {};
		// self.dynType.financialAssessment = self.dynType.financialAssessment || {};
		// self.dynType.financialAssessment.income = self.dynType.financialAssessment.income || Data.getIncomeList();
		// self.dynType.financialAssessment.expenses = self.dynType.financialAssessment.expenses || Data.getExpensesList();

		/**
		 *	Dependants Section
		 */

		// Store dependants in the household
		self.dynType.household = [{
			name: self.dynType.firstName + ' ' + self.dynType.lastName,
			relationship: 'Applicant',
			dateOfBirth: self.dynType.dateOfBirth
		}];

		// Set an array of dependants based on input value
		self.setDependantList = function(numberOfDependants) {
			var temp = angular.copy(self.dynType.household);
			self.dynType.household = [];
			for (var i = numberOfDependants - 1; i >= 0; i--) {
				self.dynType.household[i] = temp[i] || {};
				self.dynType.household[i].dateOfBirth =
					new Date(self.dynType.household[i].dateOfBirth);
			}
		};

		/**
		 *	Helper Functions
		 */

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
			var customer = new CustomerUser(self.dynType);
			delete customer._id;
			customer.hasApplied = true;

			customer.$save(function() {
				// Redirect after save
				$state.go('root.createCustomerUser-success', null, { reload: true });
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Find existing customer
		self.findOne = function() {
			self.dynType = CustomerUser.get({
				customerId: $stateParams.customerId
			}, function(customer){
				self.dynType.dateOfBirth = new Date(customer.dateOfBirth);
				self.numberOfDependants = customer.household.length;
				self.setDependantList(self.numberOfDependants);
			});
		};

		// Update existing customer
		self.update = function() {
			var customer = self.dynType;

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
