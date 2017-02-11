// Setting up route
angular.module('donor').config(['$stateProvider', 'AuthenticationProvider',
	/* ngInject */
	function($stateProvider, AuthenticationProvider) {
		// Donor state routing for user
		$stateProvider.
		state('root.createDonorUser', {
			url: 'donor/create',
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn,
			},
			views: {
				'content@': {
					component: 'donorCreate'
				},
			}
		}).
		state('root.createDonorUser-success', {
			url: 'donor/create/success',
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn,
			},
			views: {
				'content@': {
					component: 'donorCreateSuccess'
				}
			}
		}).
		state('root.viewDonorUser', {
			url: 'donor/:donorId',
			views: {
				'content@': {
					component: 'donorView'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.editDonorUser', {
			url: 'donor/:donorId/edit',
			views: {
				'content@': {
					component: 'donorEdit'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		});

		// Donor state routing for admin
		$stateProvider.
		state('root.listDonors', {
			url: 'admin/donors',
			views: {
				'content@': {
					component: 'donorList'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		}).
		state('root.viewDonorAdmin', {
			url: 'admin/donors/:donorId',
			views: {
				'content@': {
					component: 'donorView'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		}).
		state('root.editDonorAdmin', {
			url: 'admin/donors/:donorId/edit',
			views: {
				'content@': {
					component: 'donorEdit'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
