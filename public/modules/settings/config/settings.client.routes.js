// Setting up routes
angular.module('settings').config(['$stateProvider', '$urlRouterProvider', 'AuthenticationProvider',
	/* ngInject */
	function($stateProvider, $urlRouterProvider, AuthenticationProvider) {
		// Routing for general settings page
		$stateProvider.
		state('root.changeSettings-angular', {
			url: 'settings-angular',
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			},
			views: {
				'content@': {
					component: 'settings'
				}
			}
		}).
		state('root.changeSettings', {
			url: 'settings',
			views: {
				'content@': {
					component: 'settingsReact'
				}
			}
		});
	}
]);
