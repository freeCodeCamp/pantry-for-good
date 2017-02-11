// Setting up route
angular.module('users').config(['$stateProvider', 'AuthenticationProvider',
	/* ngInject */
	function($stateProvider, AuthenticationProvider, Media) {
		// Users state routing
		$stateProvider.
		state('root.profile', {
			url: 'settings/profile',
			views: {
				'content@': {
					component: 'editProfile'
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
					component: 'changePassword'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		// state('root.accounts', {
		// 	url: 'settings/accounts',
		// 	views: {
		// 		'content@': {
		// 			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		// 		}
		// 	},
		// 	resolve: {
		// 		CurrentUser: AuthenticationProvider.requireLoggedIn
		// 	}
		// }).
		state('root.signup', {
			url: 'signup',
			views: {
				'content@': {
					component: 'signup'
				}
			}
		}).
		state('root.signin', {
			url: 'signin',
			views: {
				'content@': {
					component: 'signin'
				}
			}
		}).
		state('root.forgot', {
			url: 'password/forgot',
			views: {
				'content@': {
					component: 'forgotPassword'
				}
			}
		}).
		state('root.reset-invalid', {
			url: 'password/reset/invalid',
			views: {
				'content@': {
					component: 'resetPasswordFailure'
				}
			}
		}).
		state('root.reset-success', {
			url: 'password/reset/success',
			views: {
				'content@': {
					component: 'resetPasswordSuccess'
				}
			}
		}).
		state('root.reset', {
			url: 'password/reset/:token',
			views: {
				'content@': {
					component: 'resetPassword'
				}
			}
		});
	}
]);
