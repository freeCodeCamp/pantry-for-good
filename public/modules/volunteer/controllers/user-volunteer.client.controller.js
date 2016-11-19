(function() {
	'use strict';

	angular.module('volunteer').controller('VolunteerUserController', VolunteerUserController);

	/* @ngInject */
	function VolunteerUserController($stateParams, $state, Authentication, VolunteerUser, moment) {
		var self = this,
				user = Authentication.user;
		// This provides Authentication context
		self.authentication = Authentication;

		// If user is not signed in redirect to signin
		if(!user) $state.go('root.signin');

		// Redirect to edit if user has already applied
		if (user && user.hasApplied && $state.is('root.createVolunteerUser')) $state.go('root.editVolunteerUser', { volunteerId: user._id });

		// Populate volunteer object if the user has filled an application
		self.volunteer = Authentication.user;

		// Helper method to determine the volunteer's age
		self.isMinor = function(dateOfBirth) {
			return moment().diff(dateOfBirth, 'years') < 18;
		};

		// Create a new volunteer
		self.create = function() {
			var volunteer = new VolunteerUser(self.volunteer);
			delete volunteer._id;
			self.volunteer.hasApplied = true;

			volunteer.$save(function(response) {
				// Redirect after save
				$state.go('root.createVolunteerUser-success', null, { reload: true });
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Find existing volunteer
		self.findOne = function() {
			self.volunteer = VolunteerUser.get({
				volunteerId: $stateParams.volunteerId
			});
		};

		// Update existing volunteer
		self.update = function() {
			var volunteer = self.volunteer;

			volunteer.$update(function() {
				// Redirect after update
				$state.go('root');
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
	}
})();
