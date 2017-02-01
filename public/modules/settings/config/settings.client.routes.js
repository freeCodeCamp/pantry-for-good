'use strict';

// Setting up routes
angular.module('settings').config(['$stateProvider', '$urlRouterProvider', 'AuthenticationProvider',
	function($stateProvider, $urlRouterProvider, AuthenticationProvider) {
		// Routing for general settings page
		$stateProvider.
		state('root.changeSettings', {
			url: 'settings',
			views: {
				'content@': {
					templateUrl: 'modules/settings/views/change-settings.client.view.html',
					controller: 'ChangeSettingsController as settingsCtrl'
				},
				'basic-settings@root.changeSettings': {
					templateUrl: 'modules/settings/views/partials/basic-settings.partial.html'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
