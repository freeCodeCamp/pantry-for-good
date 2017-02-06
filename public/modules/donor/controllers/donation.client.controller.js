(function() {
	'use strict';

	angular.module('donor').controller('DonationController', DonationController);

	/* @ngInject */
	function DonationController($stateParams, Donation) {
		this.$onInit = () => {
			this.donation = this.resolve.donationItem;
		};

		this.error = '';

		this.create = () => Donation.saveDonation(this.donation)
				.then(response =>	this.close(response.data))
				.catch(errorResponse => this.error = errorResponse.data.message);

		this.sendEmail = () => Donation.sendReceipt(this.donation)
				.then(response =>	this.close())
				.catch(errorResponse => this.error = errorResponse.data.message);
	}
})();
