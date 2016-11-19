(function() {
	'use strict';

	angular.module('donor').controller('DonorUserController', DonorUserController);

	/* @ngInject */
	function DonorUserController($stateParams, $state, Authentication, DonorUser) {
		var self = this,
				user = Authentication.user;

		// This provides Authentication context
		self.authentication = Authentication;

		// If user is not signed in redirect to signin
		if(!user) $state.go('root.signin');

		// Redirect to edit if user has already applied
		if (user && user.hasApplied && $state.is('root.createDonorUser')) $state.go('root.editDonorUser', { donorId: user._id });

		// Populate donor object if the user has filled an application
		self.donor = Authentication.user;

		// Create a new donor
		self.create = function() {
			var donor = new DonorUser(self.donor);
			delete donor._id;
			self.donor.hasApplied = true;

			donor.$save(function(response) {
				// Redirect after save
				$state.go('root.createDonorUser-success', null, { reload: true });
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Find existing donor
		self.findOne = function() {
			self.donor = DonorUser.get({
				donorId: $stateParams.donorId
			});
		};

		// Update existing donor
		self.update = function() {
			var donor = self.donor;

			donor.$update(function() {
				// Redirect after update
				$state.go('root');
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
	}
})();
