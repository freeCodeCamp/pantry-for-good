(function() {
	'use strict';

	angular.module('donor').controller('DonorAdminController', DonorAdminController);

	/* @ngInject */
<<<<<<< HEAD
	function DonorAdminController($window, $uibModal, $state, $stateParams, Authentication, DonorAdmin, DonorUser) {
=======
	function DonorAdminController($window, $uibModal, $state, $stateParams, Authentication, DonorAdmin, Questionnaire, Section, Field, $q) {
>>>>>>> origin/staging
		var self = this;

		self.donor = {};
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

		// Verify is user has admin role, redirect to home otherwise
		if (Authentication.user.roles.indexOf('admin') < 0) $state.go('root');

		// Add plugins into datatable
		self.dtOptions = {
			dom: 'Tlfrtip',
			tableTools: {
				sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
				aButtons: ['copy', 'xls']
			}
		};

		self.handleCheckboxClick = function (name, element) {

			// Initialise as array if undefined
			if (typeof self.donor[name] !== 'object') {
				self.donor[name] = [element];
				return;
			}

			// If element is not yet in array, push it, otherwise delete it from array
			var i = self.donor[name].indexOf(element);
			if (i === -1) {
				self.donor[name].push(element);
			} else {
				self.donor[name].splice(i, 1);
			}
		};

		self.generateForm = function() {
			var cRows = _.maxBy(self.fields, 'row').row, cCols = 4;
			var r, cSkip = 0;
			var emptyCell = { status: 'empty' };
			var skipCell = { status: 'skip' };

			var dynamicForm = [];

			// Limit to available sections of Donor Questionnaire
			self.filteredSections = _.sortBy(_.filter(self.sections, {'questionnaire': { 'identifier': 'qDonors' }}), 'position');

			for (var s = 0; s < self.filteredSections.length; s++) {
				var tmpRow = [];
				for (var i = 0; i < cRows; i++) {
					var tmpArr = [];
					for (var j = 0; j < cCols; j++) {
						if (cSkip > 0) {
							tmpArr.push(skipCell);
							cSkip--;
						} else {
							r = _.find(self.fields, {
								'row': i + 1,
								'column': j + 1,
								'section': self.filteredSections[s]
							});

							if (r === undefined) {
								tmpArr.push(emptyCell);
							} else {
								r.status = 'valid';
								tmpArr.push(r);
								cSkip = r.span - 1;
							} // if r is undefined
						} // if skip cells left

					} // for j, cells
					tmpRow.push(tmpArr);
				} // for i, rows
				dynamicForm.push(tmpRow);
			} // for s, sections

			self.dynForm = dynamicForm;
		}; // Function generate Form

		var promiseHash = {};
		promiseHash.sections = Section.query().$promise;
		promiseHash.fields = Field.query().$promise;

		$q.all(promiseHash)
			.then(function(results) {
				self.questionnaires = results.questionnaires;
				self.sections = results.sections;
				self.fields = results.fields;

				self.generateForm();
		});


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
				self.donor = donor;
				self.donations = donor.donations;
			});
		}

		// Create a new donor
		self.createNewDonor = function() {
			var donor = new DonorUser({
				lastName: "User",
				firstName: "New",
				email: 'user@test.com',
				manualAdd: true
			});
			donor.$save(function(response) {
				// Redirect after save
				$state.go('root.editDonorAdmin', { donorId: response._id });
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Update donor
		function update() {
			var donor = self.donor;

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
