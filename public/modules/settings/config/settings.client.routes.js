// Setting up routes
angular.module('settings').config(['$stateProvider', '$urlRouterProvider', 'AuthenticationProvider',
	/* ngInject */
	function($stateProvider, $urlRouterProvider, AuthenticationProvider, Tconfig) {
		// Routing for general settings page
		$stateProvider.
		state('root.changeSettings', {
			url: 'settings',
			resolve: {
				tconfig: function(Tconfig) {
					return Tconfig.get();
				},
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
