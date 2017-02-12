(function() {
	'use strict';

	angular.module('volunteer').controller('VolunteerUserController', VolunteerUserController);

	/* @ngInject */
	function VolunteerUserController($stateParams, $state, Authentication, VolunteerUser, moment, Form, formInit) {
		var self = this,
				user = Authentication.user;
		// This provides Authentication context
		self.authentication = Authentication;

		// Redirect to edit if user has already applied
		if (user && user.hasApplied && $state.is('root.createVolunteerUser')) $state.go('root.editVolunteerUser', { volunteerId: user._id });

		// Populate volunteer object if the user has filled an application
		self.dynType = Authentication.user;

		// Helper method to determine the volunteer's age
		self.isMinor = function(dateOfBirth) {
			return moment().diff(dateOfBirth, 'years') < 18;
		};

		self.dynMethods = Form.methods;
		formInit.get().then(function(res) {
			var init = self.dynMethods.generate(self.dynType, res, 'qVolunteers');
			self.dynForm = init.dynForm;
			self.sectionNames = init.sectionNames;
			self.foodList = init.foodList;
		});

		// Create a new volunteer
		self.create = function() {
			var volunteer = new VolunteerUser(self.dynType);
			delete volunteer._id;
			volunteer.hasApplied = true;

			volunteer.$save(function() {
				// Redirect after save
				$state.go('root.createVolunteerUser-success', null, { reload: true });
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Find existing volunteer
		self.findOne = function() {
			self.dynType = VolunteerUser.get({
				volunteerId: $stateParams.volunteerId
			}, function(volunteer) {
				self.dynType.dateOfBirth = new Date(volunteer.dateOfBirth);
			});
		};

		// Update existing volunteer
		self.update = function() {
			var volunteer = self.dynType;

			volunteer.$update(function() {
				// Redirect after update
				$state.go('root');
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
	}
})();
