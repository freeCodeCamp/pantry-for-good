(function() {
	'use strict';

	angular.module('users').controller('SettingsController', SettingsController);

	/* @ngInject */
	function SettingsController($http, $location, Users, Authentication) {
		var self = this;

		self.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!self.user) $location.path('/');

		// Update a user profile
		self.updateUserProfile = function(isValid) {
			if (isValid) {
				self.success = self.error = null;
				var user = new Users(self.user);

				user.$update(function(response) {
					self.success = true;
					Authentication.user = response;
				}, function(response) {
					self.error = response.data.message;
				});
			} else {
				self.submitted = true;
			}
		};

		// Change user password
		self.changeUserPassword = function() {
			self.success = self.error = null;

			$http.post('/users/password', self.passwordDetails).then(function(response) {
				//.success(function(response) {
				// If successful show success message and clear form
				self.success = true;
				self.passwordDetails = null;
			}).catch(function(response) {
				self.error = response.message;
			});
		};
	}
})();
