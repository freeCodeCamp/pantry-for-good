'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('root.profile', {
			url: 'settings/profile',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/settings/edit-profile.client.view.html',
					controller: 'SettingsController as settingsCtrl'
				}
			}
		}).
		state('root.password', {
			url: 'settings/password',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/settings/change-password.client.view.html',
					controller: 'SettingsController as settingsCtrl'
				}
			}
		}).
		state('root.accounts', {
			url: 'settings/accounts',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
				}
			}
		}).
		state('root.signup', {
			url: 'signup',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/authentication/signup.client.view.html',
					controller: 'AuthenticationController as authenticationCtrl'
				}
			}
		}).
		state('root.signin', {
			url: 'signin',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/authentication/signin.client.view.html',
					controller: 'AuthenticationController as authenticationCtrl'
				}
			}
		}).
		state('root.forgot', {
			url: 'password/forgot',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/password/forgot-password.client.view.html',
					controller: 'PasswordController as passwordCtrl'
				}
			}
		}).
		state('root.reset-invalid', {
			url: 'password/reset/invalid',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
				}
			}
		}).
		state('root.reset-success', {
			url: 'password/reset/success',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
				}
			}
		}).
		state('root.reset', {
			url: 'password/reset/:token',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/password/reset-password.client.view.html',
					controller: 'PasswordController as passwordCtrl'
				}
			}
		});
	}
]);
