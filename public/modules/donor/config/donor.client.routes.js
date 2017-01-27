'use strict';

// Setting up route
angular.module('donor').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Donor state routing for user
		$stateProvider.
		state('root.createDonorUser', {
			url: 'donor/create',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/user/create-donor.client.view.html',
					controller: 'DonorUserController as donorCtrl'
				},
				'general-info@root.createDonorUser': {
					templateUrl: 'modules/donor/views/partials/general-info.partial.html'
				}
			}
		}).
		state('root.createDonorUser-success', {
			url: 'donor/create/success',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/user/create-donor-success.client.view.html'
				}
			}
		}).
		state('root.viewDonorUser', {
			url: 'donor/:donorId',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/view-donor.client.view.html',
					controller: 'DonorUserController as donorCtrl'
				}
			}
		}).
		state('root.editDonorUser', {
			url: 'donor/:donorId/edit',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/edit-donor.client.view.html',
					controller: 'DonorUserController as donorCtrl'
				},
				'general-info@root.editDonorUser': {
					templateUrl: 'modules/donor/views/partials/general-info.partial.html'
				}
			}
		});

		// Donor state routing for admin
		$stateProvider.
		state('root.listDonors', {
			url: 'admin/donors',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/admin/list-donors.client.view.html',
					controller: 'DonorAdminController as donorCtrl'
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
					templateUrl: 'modules/donor/views/view-donor.client.view.html',
					controller: 'DonorAdminController as donorCtrl'
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
					templateUrl: 'modules/donor/views/edit-donor.client.view.html',
					controller: 'DonorAdminController as donorCtrl'
				},
				'general-info@root.editDonorAdmin': {
					templateUrl: 'modules/donor/views/partials/general-info.partial.html'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
