import changeMediaTemplate from '../views/change-media.client.view.html';

// Setting up routes
angular.module('media').config(['$stateProvider', '$urlRouterProvider', 'AuthenticationProvider',
	function($stateProvider, $urlRouterProvider, AuthenticationProvider) {
		// Routing for general settings page
		$stateProvider.
		state('root.changeMedia', {
			url: 'media',
			views: {
				'content@': {
					template: changeMediaTemplate,
					controller: 'ChangeMediaController as mediaCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
