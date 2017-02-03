(function() {
	'use strict';

	angular.module('volunteer').controller('VolunteerAdminController', VolunteerAdminController);

	/* @ngInject */
	function VolunteerAdminController($window, $stateParams, $state, Authentication, VolunteerAdmin, Form, View, SectionsAndFields) {
		var self = this;

		// This provides Authentication context
		self.authentication = Authentication;
		// Use SectionsAndFields service to load sections and fields from db
		// If on edit view, use Form service to create dynamic form from questionnaire editor
		if ($state.current.name === 'root.editVolunteerAdmin') {
			SectionsAndFields.get().then(function(res) {
				self.dynForm = Form.generate(self.volunteer, res, 'qVolunteers');
				self.sectionNames = Form.getSectionNames(res, 'qVolunteers'); 
			});
		} else if ($state.current.name === 'root.viewVolunteerAdmin') {
			// If on 'view' view, use View service to create dynamic view from questionnaire editor
			SectionsAndFields.get().then(function(res) {
				self.dynView = View.generate(self.volunteer, res, 'qVolunteers');
				self.sectionNames = View.getSectionNames(res, 'qVolunteers'); 
			});
		}


		// Add plugins into datatable
		self.dtOptions = {
			dom: 'Tlfrtip',
			tableTools: {
				sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
				aButtons: ['copy', 'xls']
			}
		};

		// Find a list of volunteers
		self.find = function() {
			self.volunteers = VolunteerAdmin.query();
		};

		// Find existing volunteer
		self.findOne = function() {
			self.volunteer = VolunteerAdmin.get({
				volunteerId: $stateParams.volunteerId
			}, function(volunteer) {
				self.volunteer.dateOfBirth = new Date(volunteer.dateOfBirth);
			});
		};

		// Update existing volunteer
		self.update = function(updateType) {
			var volunteer = self.volunteer;

			if (updateType === 'Driver') {
				volunteer.driver = true;
			} else if (updateType === 'Inactive') {
				volunteer.status = updateType;
				volunteer.driver = false;
			} else {
				volunteer.status = updateType;
			}

			volunteer.$update(function() {
				// Redirect after save
				$state.go('root.listVolunteers');
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Delete volunteer
		self.delete = function(volunteer) {
			if ($window.confirm('Are you sure?')) {
				volunteer.$delete(function() {
					$state.go('root.listVolunteers', null, { reload: true });
				}, function(errorResponse) {
					self.error = errorResponse.data.message;
				});
			}
		};
	}
})();
