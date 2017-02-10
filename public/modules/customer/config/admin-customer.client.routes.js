'use strict';

// Setting up route
angular.module('customer').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider){
		// Customer state routing for admin
		$stateProvider.
		state('root.listCustomers', {
			url: 'admin/customers',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/admin/list-customers.client.view.html',
					controller: 'CustomerAdminController as dynCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		}).
		state('root.viewCustomerAdmin', {
			url: 'admin/customers/:customerId',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/view-customer.client.view.html',
					controller: 'CustomerAdminController as dynCtrl'
				},
				'dynamic-view@root.viewCustomerAdmin': {
					templateUrl: 'modules/core/views/partials/dynamic-view.partial.html'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		}).
		state('root.editCustomerAdmin', {
			url: 'admin/customers/:customerId/edit',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/edit-customer.client.view.html',
					controller: 'CustomerAdminController as dynCtrl'
				},
				'dynamic-form@root.editCustomerAdmin': {
					templateUrl: 'modules/core/views/partials/dynamic-form.partial.html'
				},
				'household@root.editCustomerAdmin': {
					templateUrl: 'modules/customer/views/partials/household.partial.html'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
