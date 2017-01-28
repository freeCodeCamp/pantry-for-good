'use strict';

// Setting up routes
angular.module('schedule').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Schedule state routing
		$stateProvider.
		state('root.schedules', {
			url: 'admin/schedules',
			views: {
				'content@': {
					templateUrl: 'modules/schedule/views/schedules.client.view.html',
					controller: 'ScheduleController as scheduleCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
