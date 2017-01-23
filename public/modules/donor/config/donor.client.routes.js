import createDonationTemplate from '../views/admin/create-donation.client.view.html';
import listDonorsTemplate from '../views/admin/list-donors.client.view.html';
import viewDonationTemplate from '../views/admin/view-donation.client.view.html';
import createDonorTemplate from '../views/user/create-donor.client.view.html';
import createDonorSuccessTemplate from '../views/user/create-donor-success.client.view.html';
import editDonorTemplate from '../views/edit-donor.client.view.html';
import viewDonorTemplate from '../views/view-donor.client.view.html';
import dynamicFormTemplate from '../../core/views/partials/dynamic-form.partial.html';

// Setting up route
angular.module('donor').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Donor state routing for user
		$stateProvider.
		state('root.createDonorUser', {
			url: 'donor/create',
			views: {
				'content@': {
					template: createDonorTemplate,
					controller: 'DonorUserController as dynCtrl'
				},
				'dynamic-form@root.createDonorUser': {
					template: dynamicFormTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.createDonorUser-success', {
			url: 'donor/create/success',
			views: {
				'content@': {
					template: createDonorSuccessTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.viewDonorUser', {
			url: 'donor/:donorId',
			views: {
				'content@': {
					template: viewDonorTemplate,
					controller: 'DonorUserController as dynCtrl'
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
					template: editDonorTemplate,
					controller: 'DonorUserController as dynCtrl'
				},
				'dynamic-form@root.editDonorUser': {
					template: dynamicFormTemplate
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
					template: listDonorsTemplate,
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
					template: viewDonorTemplate,
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
					template: editDonorTemplate,
					controller: 'DonorAdminController as dynCtrl'
				},
				'dynamic-form@root.editDonorAdmin': {
					template: dynamicFormTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
