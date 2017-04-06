// Setting up route
angular.module('users').config(['$stateProvider', 'AuthenticationProvider',
	/* ngInject */
	function($stateProvider, AuthenticationProvider, Media) {
		// Users state routing
		$stateProvider.
		state('root.profile-angular', {
			url: 'settings/profile-angular',
			views: {
				'content@': {
					component: 'editProfile'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).		
		state('root.profile', {
			url: 'settings/profile',
			views: {
				'content@': {
					component: 'editProfileReact'
				}
			}
		}).
		// state('root.password-angular', {
		// 	url: 'settings/password-angular',
		// 	views: {
		// 		'content@': {
		// 			component: 'changePassword'
		// 		}
		// 	},
		// 	resolve: {
		// 		CurrentUser: AuthenticationProvider.requireLoggedIn
		// 	}
		// }).
		state('root.password', {
			url: 'settings/password',
			views: {
				'content@': {
					component: 'changePasswordReact'
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
		state('root.signup-angular', {
			url: 'signup-angular',
			views: {
				'content@': {
					component: 'signup'
				}
			}
		}).
		state('root.signup', {
			url: 'signup',
			views: {
				'content@': {
					component: 'signUpReact'
				}
			}
		}).		
		state('root.signin-angular', {
			url: 'signin-angular',
			views: {
				'content@': {
					component: 'signin'
				}
			}
		}).state('root.signin', {
			url: 'signin',
			views: {
				'content@': {
					component: 'signInReact'
				}
			}
		}).
		state('root.forgot-angular', {
			url: 'password/forgot-angular',
			views: {
				'content@': {
					component: 'forgotPassword'
				}
			}
		}).
		state('root.forgot', {
			url: 'password/forgot',
			views: {
				'content@': {
					component: 'forgotPasswordReact'
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
