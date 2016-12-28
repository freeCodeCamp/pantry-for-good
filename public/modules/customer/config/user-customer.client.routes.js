'use strict';

// Setting up route
angular.module('customer').config(['$stateProvider',
	function($stateProvider){
		// Customer state routing for user
		$stateProvider.
		state('root.createCustomerUser', {
			url: 'customer/create',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/user/create-customer.client.view.html',
					controller: 'CustomerUserController as customerCtrl'
				},
				'food-preferences@root.createCustomerUser': {
					templateUrl: 'modules/customer/views/partials/food-preferences.partial.html'
				},
				'household@root.createCustomerUser': {
					templateUrl: 'modules/customer/views/partials/household.partial.html'
				},
				'waiver@root.createCustomerUser': {
					templateUrl: 'modules/customer/views/partials/waiver.partial.html'
				}
			}
		}).
		state('root.createCustomerUser-success', {
			url: 'customer/create/success',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/user/create-customer-success.client.view.html'
				}
			}
		}).
		state('root.viewCustomerUser', {
			url: 'customer/:customerId',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/view-customer.client.view.html',
					controller: 'CustomerUserController as customerCtrl'
				}
			}
		}).
		state('root.editCustomerUser', {
			url: 'customer/:customerId/edit',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/edit-customer.client.view.html',
					controller: 'CustomerUserController as customerCtrl'
				},
				'food-preferences@root.editCustomerUser': {
					templateUrl: 'modules/customer/views/partials/food-preferences.partial.html'
				},
				'household@root.editCustomerUser': {
					templateUrl: 'modules/customer/views/partials/household.partial.html'
				}
			}
		});
	}
]);
