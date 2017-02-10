// Setting up route
angular.module('customer').config(['$stateProvider', 'AuthenticationProvider',
	/* ngInject */
	function($stateProvider, AuthenticationProvider, Media){
		// Customer state routing for user
		$stateProvider.
		state('root.createCustomerUser', {
			url: 'customer/create',
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn,
				media: function(Media) {
					return Media.get();
				}
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
				CurrentUser: AuthenticationProvider.requireLoggedIn,
				media: function(Media) {
					return Media.get();
				}
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
