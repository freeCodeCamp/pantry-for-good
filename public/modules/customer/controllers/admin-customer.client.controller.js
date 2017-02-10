'use strict';
	angular.module('customer').controller('CustomerAdminController', CustomerAdminController);

	/* @ngInject */
	function CustomerAdminController($window, $stateParams, $state, Authentication, CustomerAdmin, Form, View, formInit) {
		var self = this;
		
		// This provides Authentication context
		self.authentication = Authentication;
		self.dynType = self.dynType || {};

		// Use formInit service to load sections and fields from db
		// If on edit view, use Form service to create dynamic form from questionnaire editor
		if ($state.current.name === 'root.editCustomerAdmin') {
			self.dynMethods = Form.methods;
		} else if ($state.current.name === 'root.viewCustomerAdmin') {
			self.dynMethods = View.methods;
		}

		if ($state.current.name === 'root.editCustomerAdmin' || $state.current.name ===  'root.viewCustomerAdmin') {
			formInit.get().then(function(res) {
				var init = self.dynMethods.generate(self.dynType, res, 'qClients');
				self.dynForm = init.dynForm;
				self.sectionNames = init.sectionNames;
				self.foodList = init.foodList;
			});
		}

		/**
		 *	Dependants Section
		 */

		// Store dependants in the household
		self.dynType.household = [{
			name: self.dynType.firstName + ' ' + self.dynType.lastName,
			relationship: 'Applicant',
			dateOfBirth: new Date(self.dynType.dateOfBirth)
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

		// Add plugins into datatable
		self.dtOptions = {
			dom: 'TCRlfrtip',
			tableTools: {
        sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
				aButtons: ['copy', 'xls']
			}
		};

		/**
		 * Helper Functions
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

		// Find a list of customers
		self.find = function() {
			self.customers = CustomerAdmin.query();
		};

		// Find existing customer
		self.findOne = function() {
			self.dynType = CustomerAdmin.get({
				customerId: $stateParams.customerId
			}, function(customer){
				self.dynType.dateOfBirth = new Date(customer.dateOfBirth);
				self.numberOfDependants = customer.household.length;
				self.setDependantList(self.numberOfDependants);
			});
		};

		// Update existing customer
		self.update = function(status) {
			if (status) self.dynType.status = status;

			self.dynType.$update()
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
