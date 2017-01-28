'use strict';

// Setting up route
angular.module('volunteer').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Volunteer state routing for user
		$stateProvider.
		state('root.createVolunteerUser', {
			url: 'volunteer/create',
			views: {
				'content@': {
					templateUrl: 'modules/volunteer/views/user/create-volunteer.client.view.html',
					controller: 'VolunteerUserController as volunteerCtrl'
				},
				'general-info@root.createVolunteerUser': {
					templateUrl: 'modules/volunteer/views/partials/general-info.partial.html'
				}
			}
		}).
		state('root.createVolunteerUser-success', {
			url: 'volunteer/create/success',
			views: {
				'content@': {
					templateUrl: 'modules/volunteer/views/user/create-volunteer-success.client.view.html'
				}
			}
		}).
		state('root.viewVolunteerUser', {
			url: 'volunteer/:volunteerId',
			views: {
				'content@': {
					templateUrl: 'modules/volunteer/views/view-volunteer.client.view.html',
					controller: 'VolunteerUserController as volunteerCtrl'
				}
			}
		}).
		state('root.editVolunteerUser', {
			url: 'volunteer/:volunteerId/edit',
			views: {
				'content@': {
					templateUrl: 'modules/volunteer/views/edit-volunteer.client.view.html',
					controller: 'VolunteerUserController as volunteerCtrl'
				},
				'general-info@root.editVolunteerUser': {
					templateUrl: 'modules/volunteer/views/partials/general-info.partial.html'
				}
			}
		});

		// Volunteer state routing for admin
		$stateProvider.
		state('root.listVolunteers', {
			url: 'admin/volunteers',
			views: {
				'content@': {
					templateUrl: 'modules/volunteer/views/admin/list-volunteers.client.view.html',
					controller: 'VolunteerAdminController as volunteerCtrl'
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
					templateUrl: 'modules/volunteer/views/view-volunteer.client.view.html',
					controller: 'VolunteerAdminController as volunteerCtrl'
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
					templateUrl: 'modules/volunteer/views/edit-volunteer.client.view.html',
					controller: 'VolunteerAdminController as volunteerCtrl'
				},
				'general-info@root.editVolunteerAdmin': {
					templateUrl: 'modules/volunteer/views/partials/general-info.partial.html'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
