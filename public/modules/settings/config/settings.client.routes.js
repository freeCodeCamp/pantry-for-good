// Setting up routes
angular.module('settings').config(['$stateProvider', '$urlRouterProvider', 'AuthenticationProvider',
	/* ngInject */
	function($stateProvider, $urlRouterProvider, AuthenticationProvider) {
		// Routing for general settings page
		$stateProvider.
		state('root.changeSettings', {
			url: 'settings',
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			},
			views: {
				'content@': {
					component: 'settings'
				}
			}
		});
	}
]);
