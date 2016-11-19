(function() {
	'use strict';

	angular.module('donor').controller('DonationController', DonationController);

	/* @ngInject */
	function DonationController($modalInstance, $stateParams, Donation, donationItem) {
		var self = this;

		self.close = $modalInstance.close;
		self.create = create;
		self.sendEmail = sendEmail;
		self.dismiss = $modalInstance.dismiss;
		self.donation = donationItem;
		self.error = '';

		function create() {
			var donation = self.donation;

			Donation.saveDonation(donation)
				.then(function(response) {
					self.close(response.data);
				})
				.catch(function(errorResponse) {
					self.error = errorResponse.data.message;
				})
			;
		}
		
		function sendEmail() {
			var donation = self.donation;
					
			Donation.sendReceipt(donation)
				.then(function(response) {
					self.close();
				})
				.catch(function(errorResponse) {
					self.error = errorResponse.data.message;
				})
			;
		}
		
	}
})();
