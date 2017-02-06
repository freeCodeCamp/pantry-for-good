// Setting up route
angular.module('customer').config(['$stateProvider', 'AuthenticationProvider',
	/* ngInject */
	function($stateProvider, AuthenticationProvider, Tconfig){
		// Customer state routing for user
		$stateProvider.
		state('root.createCustomerUser', {
			url: 'customer/create',
			resolve: {
				tconfig: function(Tconfig) {
					return Tconfig.get();
				},
				CurrentUser: AuthenticationProvider.requireLoggedIn
			},
			views: {
				'content@': {
					component: 'customerCreate'
				}
			}
		}).
		state('root.createCustomerUser-success', {
			url: 'customer/create/success',
			resolve: {
				tconfig: function(Tconfig) {
					return Tconfig.get();
				},
				CurrentUser: AuthenticationProvider.requireLoggedIn
			},
			views: {
				'content@': {
					component: 'customerCreateSuccess'
				}
			}
		}).
		state('root.viewCustomerUser', {
			url: 'customer/:customerId',
			views: {
				'content@': {
					component: 'customerView'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.editCustomerUser', {
			url: 'customer/:customerId/edit',
			views: {
				'content@': {
					component: 'customerEdit'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		});
	}
]);
