(function() {
	'use strict';

	angular.module('donor').controller('DonorAdminController', DonorAdminController);

	/* @ngInject */
	function DonorAdminController($window, $uibModal, $state, $stateParams, Authentication, DonorAdmin, Form, formInit) {
		var self = this;

		// This provides Authentication context
		self.authentication = Authentication;
		self.dynType = self.dynType || {};

		self.dynMethods = Form.methods;
		formInit.get().then(function(res) {
			var init = self.dynMethods.generate(self.dynType, res, 'qDonors');
			self.dynForm = init.dynForm;
			self.sectionNames = init.sectionNames;
			self.foodList = init.foodList;
		});

		self.donations = [];
		self.donationsCopy = [].concat(self.donations); // Copy data for Smart Table
		self.donors = [];
		self.dtOptions = {};
		self.find = find;
		self.findOne = findOne;
		self.update = update;
		self.newDonation = newDonation;
		self.viewDonation = viewDonation;
		self.remove = remove;

		// Add plugins into datatable
		self.dtOptions = {
			dom: 'Tlfrtip',
			tableTools: {
				sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
				aButtons: ['copy', 'xls']
			}
		};

		// Find a list of donors
		function find() {
			self.donors = DonorAdmin.query({}, function(donors) {
				// Calculate and add a total donated property for each donor
				donors.forEach(function(donor) {
					donor.totalDonated = 0;

					if (donor.donations && donor.donations.length) {
						donor.totalDonated = donor.donations.reduce(function(prev, curr) {
							return prev + (curr.eligibleForTax || 0);
						}, 0);
					}
				});
			});
		}

		// Find existing donor
		function findOne() {
			DonorAdmin.get({
				donorId: $stateParams.donorId
			}, function(donor) {
				self.dynType = donor;
				self.donations = donor.donations;
			});
		}

		// Update donor
		function update() {
			var donor = self.dynType;

			donor.$update(function() {
				// Redirect after update
				$state.go('root.listDonors');
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		}

		// Delete donor
		function remove(donor) {
			if ($window.confirm('Are you sure?')) {
				donor.$remove(function() {
					$state.go('root.listDonors', null, { reload: true });
				}, function(errorResponse) {
					self.error = errorResponse.data.message;
				});
			}
		}

		// Open donation form in a modal window
		function newDonation() {
			var modalInstance = $uibModal.open({
				templateUrl: 'modules/donor/views/admin/create-donation.client.view.html',
				controller: 'DonationController as donationCtrl',
				resolve: {
					donationItem: function() {
						return {};
					}
				}
			});

			modalInstance.result.then(function(donation) {
				if (donation) {
					self.donations.push(donation);
					self.update();
				}
			});
		}

		// View donation in a modal window
		function viewDonation(donation) {
			$uibModal.open({
				templateUrl: 'modules/donor/views/admin/view-donation.client.view.html',
				controller: 'DonationController as donationCtrl',
				resolve: {
					donationItem: function() {
						return donation;
					}
				}
			});
		}
	}
})();
