import changePasswordTemplate from '../views/settings/change-password.client.view.html';
import editProfileTemplate from '../views/settings/edit-profile.client.view.html';
import signinTemplate from '../views/authentication/signin.client.view.html';
import signupTemplate from '../views/authentication/signup.client.view.html';
import forgotPasswordTemplate from '../views/password/forgot-password.client.view.html';
import resetPasswordTemplate from '../views/password/reset-password.client.view.html';
import resetPasswordSuccessTemplate from '../views/password/reset-password-success.client.view.html';
import resetPasswordInvalidTemplate from '../views/password/reset-password-invalid.client.view.html';
import socialAccountsTemplate from '../../'

// Setting up route
angular.module('users').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Users state routing
		$stateProvider.
		state('root.profile', {
			url: 'settings/profile',
			views: {
				'content@': {
					template: editProfileTemplate,
					controller: 'SettingsController as settingsCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.password', {
			url: 'settings/password',
			views: {
				'content@': {
					template: changePasswordTemplate,
					controller: 'SettingsController as settingsCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.accounts', {
			url: 'settings/accounts',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.signup', {
			url: 'signup',
			views: {
				'content@': {
					template: signupTemplate,
					controller: 'AuthenticationController as authenticationCtrl'
				}
			}
		}).
		state('root.signin', {
			url: 'signin',
			views: {
				'content@': {
					template: signinTemplate,
					controller: 'AuthenticationController as authenticationCtrl'
				}
			}
		}).
		state('root.forgot', {
			url: 'password/forgot',
			views: {
				'content@': {
					template: forgotPasswordTemplate,
					controller: 'PasswordController as passwordCtrl'
				}
			}
		}).
		state('root.reset-invalid', {
			url: 'password/reset/invalid',
			views: {
				'content@': {
					template: resetPasswordInvalidTemplate
				}
			}
		}).
		state('root.reset-success', {
			url: 'password/reset/success',
			views: {
				'content@': {
					template: resetPasswordSuccessTemplate
				}
			}
		}).
		state('root.reset', {
			url: 'password/reset/:token',
			views: {
				'content@': {
					template: resetPasswordTemplate,
					controller: 'PasswordController as passwordCtrl'
				}
			}
		});
	}
]);
