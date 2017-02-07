// Setting up routes
angular.module('schedule').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Schedule state routing
		$stateProvider.
		state('root.schedules', {
			url: 'admin/schedules',
			views: {
				'content@': {
					component: 'schedules'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
