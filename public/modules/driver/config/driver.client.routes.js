import driverAdminTemplate from '../views/admin-driver.client.view.html';
import driverUserTemplate from '../views/user-driver.client.view.html';
import driverRoutesTemplate from '../views/routes-driver.client.view.html';

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
					template: driverUserTemplate,
					controller: 'DriverUserController as driverCtrl'
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
					template: driverAdminTemplate,
					controller: 'DriverAdminController as driverCtrl'
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
					template: driverRoutesTemplate,
					controller: 'DriverRouteController as driverCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
