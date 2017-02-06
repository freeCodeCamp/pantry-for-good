// Setting up routes
angular.module('media').config(['$stateProvider', '$urlRouterProvider', 'AuthenticationProvider',
	/* ngInject */
	function($stateProvider, $urlRouterProvider, AuthenticationProvider, Tconfig, Media) {
		// Routing for general settings page
		$stateProvider.
		state('root.changeMedia', {
			url: 'media',
			resolve: {
				tconfig: function(Tconfig) {
					return Tconfig.get();
				},
				media: function(Media) {
					return Media.get();
				},
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
