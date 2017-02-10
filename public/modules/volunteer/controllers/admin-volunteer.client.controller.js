(function() {
	'use strict';

	angular.module('volunteer').controller('VolunteerAdminController', VolunteerAdminController);

	/* @ngInject */
	function VolunteerAdminController($window, $stateParams, $state, Authentication, VolunteerAdmin, Form, View, formInit) {
		var self = this;

		// This provides Authentication context
		self.authentication = Authentication;

		// Use formInit service to load sections and fields from db
		// If on edit view, use Form service to create dynamic form from questionnaire editor
		if ($state.current.name === 'root.editVolunteerAdmin') {
			self.dynMethods = Form.methods;
		} else if ($state.current.name === 'root.viewVolunteerAdmin') {
			self.dynMethods = View.methods;
		}

		if ($state.current.name === 'root.editVolunteerAdmin' || $state.current.name ===  'root.viewVolunteerAdmin') {
			formInit.get().then(function(res) {
				var init = self.dynMethods.generate(self.dynType, res, 'qVolunteers');
				self.dynForm = init.dynForm;
				self.sectionNames = init.sectionNames;
				self.foodList = init.foodList;
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
			self.dynType = VolunteerAdmin.get({
				volunteerId: $stateParams.volunteerId
			}, function(volunteer) {
				self.dynType.dateOfBirth = new Date(volunteer.dateOfBirth);
			});
		};

		// Update existing volunteer
		self.update = function(updateType) {
			var volunteer = self.dynType;

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
