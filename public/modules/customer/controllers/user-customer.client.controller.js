(function() {
	'use strict';

	angular.module('customer').controller('CustomerUserController', CustomerUserController);

	/* @ngInject */
	function CustomerUserController($stateParams, $state, Authentication, CustomerUser, moment, Data, Section, Field, $q) {
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


		// ======================QTEST==========QTEST============QTEST===================
		// ======================QTEST==========QTEST============QTEST===================

		self.handleCheckboxClick = function (name, element) {

			// Initialise as array if undefined
			if (typeof self.customer[name] !== 'object') {
				self.customer[name] = [element];
				return;
			}

			// If element is not yet in array, push it, otherwise delete it from array
			var i = self.customer[name].indexOf(element);
			if (i === -1) {
				self.customer[name].push(element);
			} else {
				self.customer[name].splice(i, 1);
			}
		};

		self.generateForm = function() {
			var cRows = _.maxBy(self.fields, 'row').row, cCols = 4;
			var r, cSkip = 0;
			var emptyCell = { status: 'empty' };
			var skipCell = { status: 'skip' };

			var dynamicForm = [];
			// HARDWIRED FOR DEV: Limit to available sections of Client Questionnaire
			self.filteredSections = _.sortBy(_.filter(self.sections, {'questionnaire': { '_id': '581da83d367d0b1eef2e8d9e' }}), 'position');

			for (var s = 0; s < self.filteredSections.length; s++) {
				var tmpRow = [];
				for (var i = 0; i < cRows; i++) {
					var tmpArr = [];
					for (var j = 0; j < cCols; j++) {
						if (cSkip > 0) {
							tmpArr.push(skipCell);
							cSkip--;
						} else {
							r = _.find(self.fields, {
								'row': i + 1,
								'column': j + 1,
								'section': self.filteredSections[s]
							});

							if (r === undefined) {
								tmpArr.push(emptyCell);
							} else {
								r.status = 'valid';
								tmpArr.push(r);
								cSkip = r.span - 1;
							} // if r is undefined
						} // if skip cells left

					} // for j, cells
					tmpRow.push(tmpArr);
				} // for i, rows
				dynamicForm.push(tmpRow);
			} // for s, sections

			self.dynForm = dynamicForm;
		}; // Function generate Form

		var promiseHash = {};
    // promiseHash.questionnaires = Questionnaire.query().$promise;
    promiseHash.sections = Section.query().$promise;
    promiseHash.fields = Field.query().$promise;

    $q.all(promiseHash)
			.then(function(results) {
				self.questionnaires = results.questionnaires;
				self.sections = results.sections;
				self.fields = results.fields;

				self.generateForm();
		});
// ======================QTEST==========QTEST============QTEST===================
// ======================QTEST==========QTEST============QTEST===================

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
