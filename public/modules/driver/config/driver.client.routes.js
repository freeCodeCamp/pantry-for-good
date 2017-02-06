// Setting up routes
angular.module('driver').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		$stateProvider.
		state('root.driver', {
			abstract: true
		}).
		// Driver state routing for user
		state('root.driver.user', {
			url: 'driver/routes',
			views: {
				'content@': {
					component: 'driverUser'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		// Driver state routing for admin
		state('root.driver.admin', {
			url: 'admin/drivers',
			views: {
				'content@': {
					component: 'driverAdmin'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		}).
		state('root.driver.routes', {
			url: 'admin/drivers/routes',
			views: {
				'content@': {
					component: 'driverRoutes'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
