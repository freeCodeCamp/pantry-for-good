import angular from 'angular';
import {stateGo} from 'redux-ui-router';

const mapStateToThis = state => ({
	auth: state.auth,
});

const mapDispatchToThis = dispatch => ({
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

angular.module('donor').controller('DonorController', DonorController);

/* @ngInject */
function DonorController($window, $uibModal, $state, $stateParams, Authentication,
													DonorAdmin, DonorUser, Form, formInit, Tconfig, $ngRedux) {
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
		this.dynType = this.dynType || {};
		this.donations = [];
		this.donationsCopy = [].concat(this.donations); // Copy data for Smart Table
		this.donors = [];
		// this.dtOptions = {};
		const {user} = this.auth;
		const isAdmin = user.roles.indexOf('admin') !== -1;

		if (!isAdmin) {
			// Redirect to edit if user has already applied
			if (user.hasApplied && $state.is('root.createDonorUser'))
				this.push('root.editDonorUser', { donorId: user._id });

			// Verify is user has admin role, redirect to home otherwise
			if (!isAdmin && $state.includes('*Admin') || $state.includes('.listDonors'))
				this.push('root');

			// Populate donor object if the user has filled an application
			this.dynType = user;

			this.dynMethods = Form.methods;
			formInit.get().then(res => {
				var init = this.dynMethods.generate(this.dynType, res, 'qDonors');
				this.dynForm = init.dynForm;
				this.sectionNames = init.sectionNames;
				this.foodList = init.foodList;
			});
		}

		this.create = this.create.bind(this);
		this.find = this.find.bind(this);
		this.findOne = this.findOne.bind(this);
		this.update = this.update.bind(this);
		this.remove = this.remove.bind(this);
		this.newDonation = this.newDonation.bind(this);
		this.isAdmin = isAdmin;
	};

	this.$onDestroy = () => this.unsubscribe();

	// Add plugins into datatable
	this.dtOptions = {
		dom: 'Tlfrtip',
		tableTools: {
			sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
			aButtons: ['copy', 'xls']
		}
	};

	// Create a new donor
	this.create = function() {
		var donor = new DonorUser(this.dynType);
		delete donor._id;
		this.dynType.hasApplied = true;

		donor.$save(() => {
			// Redirect after save
			$state.go('root.createDonorUser-success', null, { reload: true });
		}, errorResponse => {
			this.error = errorResponse.data.message;
		});
	};

	// Find a list of donors
	this.find = function() {
		this.donors = DonorAdmin.query({}, function(donors) {
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
	};

	// Find existing donor
	this.findOne = function() {
		const DonorService = this.isAdmin ? DonorAdmin : DonorUser;
		DonorService.get({
			donorId: $stateParams.donorId
		}, donor => {
			this.dynType = donor;
			this.donations = donor.donations;
		});
	};

	// Update donor
	this.update = () => {
		var donor = this.dynType;

		donor.$update(() => {
			// Redirect after update
			$state.go(this.isAdmin ? 'root.listDonors' : 'root');
		}, errorResponse => {
			this.error = errorResponse.data.message;
		});
	};

	// Delete donor
	this.remove = function(donor) {
		if ($window.confirm('Are you sure?')) {
			donor.$remove(() => {
				$state.go('root.listDonors', null, { reload: true });
			}, errorResponse => {
				this.error = errorResponse.data.message;
			});
		}
	};

	// Open donation form in a modal window
	this.newDonation = function() {
		var modalInstance = $uibModal.open({
			component: 'donationCreate',
			resolve: {
				donationItem: function() {
					return {};
				}
			}
		});

		modalInstance.result.then(donation => {
			if (donation) {
				this.donations.push(donation);
				this.update();
			}
		});
	};

	// View donation in a modal window
	this.viewDonation = function(donation) {
		$uibModal.open({
			component: 'donationView',
			resolve: {
				donationItem: function() {
					return donation;
				},
				tconfig: function(Tconfig) {
					return Tconfig.get();
				}
			}
		});
	};
}
