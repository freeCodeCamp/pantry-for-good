'use strict';

// Setting up routes
angular.module('driver').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('root.driver', {
			abstract: true
		}).
		// Driver state routing for user
		state('root.driver.user', {
			url: 'driver/routes',
			views: {
				'content@': {
					templateUrl: 'modules/driver/views/user-driver.client.view.html',
					controller: 'DriverUserController as driverCtrl'
				}
			}
		}).
		// Driver state routing for admin
		state('root.driver.admin', {
			url: 'admin/drivers',
			views: {
				'content@': {
					templateUrl: 'modules/driver/views/admin-driver.client.view.html',
					controller: 'DriverAdminController as driverCtrl'
				}
			}
		}).
		state('root.driver.routes', {
			url: 'admin/drivers/routes',
			views: {
				'content@': {
					templateUrl: 'modules/driver/views/routes-driver.client.view.html',
					controller: 'DriverRouteController as driverCtrl'
				}
			}
		});
	}
]);
