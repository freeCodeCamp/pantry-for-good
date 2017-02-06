import angular from 'angular';

angular.module('customer').controller('CustomerController', CustomerController);

function CustomerController($window, $stateParams, $state, Authentication, CustomerAdmin, Form,
														View, formInit, CustomerUser, moment, Data) {
	// This provides Authentication context
	this.authentication = Authentication;
	this.user = this.authentication.user;
	this.isAdmin = this.user && this.user.roles.indexOf('admin') !== -1;
	this.dynType = this.dynType || {};

	// Use formInit service to load sections and fields from db
	// If on edit view, use Form service to create dynamic form from questionnaire editor
	if ($state.current.name === 'root.editCustomerAdmin') {
		this.dynMethods = Form.methods;
	} else if ($state.current.name === 'root.viewCustomerAdmin') {
		this.dynMethods = View.methods;
	}
console.log('this.dynMethods', this.dynMethods)

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
			console.log('this.dynType', this.dynType)
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
}
