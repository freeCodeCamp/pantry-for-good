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
					controller: 'DonorUserController as dynCtrl'
				},
				'dynamic-form@root.createDonorUser': {
					templateUrl: 'modules/core/views/partials/dynamic-form.partial.html'
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
					controller: 'DonorUserController as dynCtrl'
				}
			}
		}).
		state('root.editDonorUser', {
			url: 'donor/:donorId/edit',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/edit-donor.client.view.html',
					controller: 'DonorUserController as dynCtrl'
				},
				'dynamic-form@root.editDonorUser': {
					templateUrl: 'modules/core/views/partials/dynamic-form.partial.html'
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
					controller: 'DonorAdminController as dynCtrl'
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
					controller: 'DonorAdminController as dynCtrl'
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
					controller: 'DonorAdminController as dynCtrl'
				},
				'dynamic-form@root.editDonorAdmin': {
					templateUrl: 'modules/core/views/partials/dynamic-form.partial.html'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
