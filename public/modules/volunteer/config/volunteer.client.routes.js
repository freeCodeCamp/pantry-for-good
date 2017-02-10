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
					controller: 'VolunteerUserController as dynCtrl'
				},
				'dynamic-form@root.createVolunteerUser': {
					templateUrl: 'modules/core/views/partials/dynamic-form.partial.html'
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
					templateUrl: 'modules/volunteer/views/user/create-volunteer-success.client.view.html'
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
					templateUrl: 'modules/volunteer/views/view-volunteer.client.view.html',
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
					templateUrl: 'modules/volunteer/views/edit-volunteer.client.view.html',
					controller: 'VolunteerUserController as dynCtrl'
				},
				'dynamic-form@root.editVolunteerUser': {
					templateUrl: 'modules/core/views/partials/dynamic-form.partial.html'
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
					templateUrl: 'modules/volunteer/views/admin/list-volunteers.client.view.html',
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
					templateUrl: 'modules/volunteer/views/view-volunteer.client.view.html',
					controller: 'VolunteerAdminController as dynCtrl'
				},
				'dynamic-view@root.viewVolunteerAdmin': {
					templateUrl: 'modules/core/views/partials/dynamic-view.partial.html'
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
					controller: 'VolunteerAdminController as dynCtrl'
				},
				'dynamic-form@root.editVolunteerAdmin': {
					templateUrl: 'modules/core/views/partials/dynamic-form.partial.html'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
