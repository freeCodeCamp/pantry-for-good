import createVolunteerTemplate from '../views/user/create-volunteer.client.view.html';
import createVolunteerSuccessTemplate from '../views/user/create-volunteer-success.client.view.html';
import listVolunteersTemplate from '../views/admin/list-volunteers.client.view.html';
import editVolunteerTemplate from '../views/edit-volunteer.client.view.html';
import viewVolunteerTemplate from '../views/view-volunteer.client.view.html';
import dynamicFormTemplate from '../../core/views/partials/dynamic-form.partial.html';
import dynamicViewTemplate from '../../core/views/partials/dynamic-view.partial.html';

// Setting up route
angular.module('volunteer').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Volunteer state routing for user
		$stateProvider.
		state('root.createVolunteerUser', {
			url: 'volunteer/create',
			views: {
				'content@': {
					template: createVolunteerTemplate,
					controller: 'VolunteerUserController as dynCtrl'
				},
				'dynamic-form@root.createVolunteerUser': {
					template: dynamicFormTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.createVolunteerUser-success', {
			url: 'volunteer/create/success',
			views: {
				'content@': {
					template: createVolunteerSuccessTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.viewVolunteerUser', {
			url: 'volunteer/:volunteerId',
			views: {
				'content@': {
					template: viewVolunteerTemplate,
					controller: 'VolunteerUserController as dynCtrl'
				},
				'dynamic-view@root.viewVolunteerUser': {
					templateUrl: 'modules/core/views/partials/dynamic-view.partial.html'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.editVolunteerUser', {
			url: 'volunteer/:volunteerId/edit',
			views: {
				'content@': {
					template: editVolunteerTemplate,
					controller: 'VolunteerUserController as dynCtrl'
				},
				'dynamic-form@root.editVolunteerUser': {
					template: dynamicViewTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		});

		// Volunteer state routing for admin
		$stateProvider.
		state('root.listVolunteers', {
			url: 'admin/volunteers',
			views: {
				'content@': {
					template: listVolunteersTemplate,
					controller: 'VolunteerAdminController as dynCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		}).
		state('root.viewVolunteerAdmin', {
			url: 'admin/volunteers/:volunteerId',
			views: {
				'content@': {
					template: viewVolunteerTemplate,
					controller: 'VolunteerAdminController as dynCtrl'
				},
				'dynamic-view@root.viewVolunteerAdmin': {
					template: dynamicViewTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		}).
		state('root.editVolunteerAdmin', {
			url: 'admin/volunteers/:volunteerId/edit',
			views: {
				'content@': {
					template: editVolunteerTemplate,
					controller: 'VolunteerAdminController as dynCtrl'
				},
				'dynamic-form@root.editVolunteerAdmin': {
					template: dynamicFormTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
