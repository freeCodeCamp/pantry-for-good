import scheduleTemplate from '../views/schedules.client.view.html';

// Setting up routes
angular.module('schedule').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Schedule state routing
		$stateProvider.
		state('root.schedules', {
			url: 'admin/schedules',
			views: {
				'content@': {
					template: scheduleTemplate,
					controller: 'ScheduleController as scheduleCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
