import changeSettingsTemplate from '../views/change-settings.client.view.html';
import basicSettingsTemplate from '../views/partials/basic-settings.partial.html';

// Setting up routes
angular.module('settings').config(['$stateProvider', '$urlRouterProvider', 'AuthenticationProvider',
	function($stateProvider, $urlRouterProvider, AuthenticationProvider) {
		// Routing for general settings page
		$stateProvider.
		state('root.changeSettings', {
			url: 'settings',
			views: {
				'content@': {
					template: changeSettingsTemplate,
					controller: 'ChangeSettingsController as settingsCtrl'
				},
				'basic-settings@root.changeSettings': {
					template: basicSettingsTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
