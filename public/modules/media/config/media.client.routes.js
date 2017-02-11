// Setting up routes
angular.module('media').config(['$stateProvider', '$urlRouterProvider', 'AuthenticationProvider',
	/* ngInject */
	function($stateProvider, $urlRouterProvider, AuthenticationProvider) {
		// Routing for general settings page
		$stateProvider.
		state('root.changeMedia', {
			url: 'media',
			resolve: {

				CurrentUser: AuthenticationProvider.requireAdminUser
			},
			views: {
				'content@': {
					component: 'changeMedia'
				}
			}
		});
	}
]);
