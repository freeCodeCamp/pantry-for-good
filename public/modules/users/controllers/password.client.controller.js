(function() {
	'use strict';

	angular.module('users').controller('PasswordController', PasswordController);

	/* @ngInject */
	function PasswordController($stateParams, $http, $state, Authentication) {
		var self = this;

		self.authentication = Authentication;

		//If user is signed in then redirect back home
		if (self.authentication.user) $state.go('root');

		// Submit forgotten password account id
		self.askForPasswordReset = function() {
			self.success = self.error = null;

			$http.post('/auth/forgot', self.credentials).success(function(response) {
				// Show user success message and clear form
				self.credentials = null;
				self.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				self.credentials = null;
				self.error = response.message;
			});
		};

		// Change user password
		self.resetUserPassword = function() {
			self.success = self.error = null;

			$http.post('/auth/reset/' + $stateParams.token, self.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				self.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$state.go('root.reset-success', null, { reload: true });
			}).error(function(response) {
				self.error = response.message;
			});
		};
	}
})();
