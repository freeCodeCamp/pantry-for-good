import angular from 'angular';
import {stateGo} from 'redux-ui-router';

const mapStateToThis = state => ({
	auth: state.auth,
	settings: state.settings.data
});

const mapDispatchToThis = dispatch => ({
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

angular.module('customer').controller('CustomerController', CustomerController);

/* @ngInject */
function CustomerController($window, $stateParams, $state, Authentication, CustomerAdmin, Form,
														View, formInit, CustomerUser, moment, Data, $ngRedux) {
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);

		this.user = this.auth.user;
		this.isAdmin = this.user && this.user.roles.indexOf('admin') !== -1;
		this.dynType = this.dynType || {};

		// Use formInit service to load sections and fields from db
		// If on edit view, use Form service to create dynamic form from questionnaire editor
		if ($state.current.name === 'root.editCustomerAdmin') {
			this.dynMethods = Form.methods;
		} else if ($state.current.name === 'root.viewCustomerAdmin') {
			this.dynMethods = View.methods;
		}

		if ($state.current.name === 'root.editCustomerAdmin' || $state.current.name ===  'root.viewCustomerAdmin') {
			formInit.get().then(res => {
				const init = this.dynMethods.generate(this.dynType, res, 'qClients');
				this.dynForm = init.dynForm;
				this.sectionNames = init.sectionNames;
				this.foodList = init.foodList;
			});

			// Find a list of customers
			this.find = () => this.dynType = CustomerAdmin.query();

			// Find existing customer
			this.findOne = () => {
				this.dynType = CustomerAdmin.get({
					customerId: $stateParams.customerId
				}, customer => {
					this.dynType.dateOfBirth = new Date(customer.dateOfBirth);
					this.numberOfDependants = customer.household.length;
					this.setDependantList(this.numberOfDependants);
				});
			};

			// Delete existing customer
			this.delete = customer => {
				if ($window.confirm('Are you sure?')) {
					customer.$delete(function() {
						$state.go('root.listCustomers', null, { reload: true });
					}, errorResponse =>
						this.error = errorResponse.data.message
					);
				}
			};

		} else if (this.user.hasApplied && $state.is('root.createCustomerUser')) {
			$state.go('root.editCustomerUser', { customerId: this.user._id })
		} else {
			// Populate customer object if the user has filled an application
			angular.extend(this.dynType, this.user);

			// Use formInit service to load sections and fields from db, View service to create dynamic view from questionnaire editor
			this.dynMethods = Form.methods;
			formInit.get().then(res => {
				var init = this.dynMethods.generate(this.dynType, res, 'qClients');
				this.dynForm = init.dynForm;
				this.sectionNames = init.sectionNames;
				this.foodList = init.foodList;
			});
		}
		/**
		 *	Dependants Section
		 */

		// Store dependants in the household
		this.dynType.household = [{
			name: this.dynType.firstName + ' ' + this.dynType.lastName,
			relationship: 'Applicant',
			dateOfBirth: new Date(this.dynType.dateOfBirth)
		}];


		// Common functions

		// Toggle selection of all food items
		this.selectAll = checked => {
			if (!checked) {
				this.customer.foodPreferences = [];
				this.foodList.forEach(item =>
					this.customer.foodPreferences.push(item._id));
			} else {
				this.customer.foodPreferences = [];
			}
		};

		// Check if food item is selected
		this.foodIsChecked = selectedFood => {
			if (this.customer.foodPreferences) {
				return this.customer.foodPreferences.indexOf(selectedFood._id) > -1;
			}
		};

		// Store food category when box is checked an remove when unchecked
		this.toggleSelection = selectedFood => {
			this.customer.foodPreferences = this.customer.foodPreferences || [];
			var index = this.customer.foodPreferences.indexOf(selectedFood._id);
			if (index > -1) {
				this.customer.foodPreferences.splice(index, 1);
			} else {
				this.customer.foodPreferences.push(selectedFood._id);
			}
		};
		// Set an array of dependants based on input value
		this.setDependantList = numberOfDependants => {
			var temp = angular.copy(this.dynType.household);
			this.dynType.household = [];
			for (var i = numberOfDependants - 1; i >= 0; i--) {
				this.dynType.household[i] = temp[i] || {};
				this.dynType.household[i].dateOfBirth =
					new Date(this.dynType.household[i].dateOfBirth);
			}
		};

		// Add plugins into datatable
		this.dtOptions = {
			dom: 'TCRlfrtip',
			tableTools: {
				sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
				aButtons: ['copy', 'xls']
			}
		};

		/**
		 *	Helper Functions
		 */

		// Refactor food item objects into a list of names separated by comma's
		this.splitByComma = foodItems => {
			if (foodItems) {
				var temp = [];
				foodItems.forEach(itemId =>
					this.foodList.forEach(food => {
						if (itemId === food._id) temp.push(food.name);
					}));
				return temp.join(', ');
			}
		};

		// Add up totals in Financial Assessment
		this.total = function(data, type) {
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
		this.create = () => {
			var customer = new CustomerUser(this.dynType);
			delete customer._id;
			this.user.hasApplied = true;

			customer.$save(() => {
				// Redirect after save
				$state.go('root.createCustomerUser-success', null, { reload: true });
			}, errorResponse => {
				this.error = errorResponse.data.message;
			});
		};

		// Update existing customer
		this.update = status => {
			if (status) this.dynType.status = status;

			this.dynType.$update()
				.then(() => {
					// Redirect after update
					if (this.isAdmin) {
						$state.go('root.listCustomers');
					} else {
						$state.go('root');
					}
				})
				.catch(err => {
					if (err) {
						this.error = err.data.message;
					}
				});
		};
	};

	// tests run before setUser action fires, how to do this better?
	this.authentication = this.authentication || {};
	this.$onDestroy = () => this.unsubscribe();
}
