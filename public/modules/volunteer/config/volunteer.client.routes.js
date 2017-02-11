// Setting up route
angular.module('volunteer').config(['$stateProvider', 'AuthenticationProvider',
	/* ngInject */
	function($stateProvider, AuthenticationProvider) {
		// Volunteer state routing for user
		$stateProvider.
		state('root.createVolunteerUser', {
			url: 'volunteer/create',
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			},
			views: {
				'content@': {
					component: 'createVolunteer'
				}
			}
		}).
		state('root.createVolunteerUser-success', {
			url: 'volunteer/create/success',
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			},
			views: {
				'content@': {
					component: 'createVolunteerSuccess'
				}
			}
		}).
		state('root.viewVolunteerUser', {
			url: 'volunteer/:volunteerId',
			views: {
				'content@': {
					component: 'viewVolunteer'
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
					component: 'editVolunteer'
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
					component: 'listVolunteers'
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
					component: 'viewVolunteer'
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
					component: 'editVolunteer'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
