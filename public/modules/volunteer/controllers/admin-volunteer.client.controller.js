(function() {
	'use strict';

	angular.module('volunteer').controller('VolunteerAdminController', VolunteerAdminController);

	/* @ngInject */
	function VolunteerAdminController($window, $stateParams, $state, Authentication, VolunteerAdmin, VolunteerUser, Section, Field, $q) {
		var self = this;

		// This provides Authentication context
		self.authentication = Authentication;

		// Verify if user has admin role, redirect to home otherwise
		if (self.authentication.user.roles.indexOf('admin') < 0) $state.go('root');

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
			if (typeof self.volunteer[name] !== 'object') {
				self.volunteer[name] = [element];
				return;
			}

			// If element is not yet in array, push it, otherwise delete it from array
			var i = self.volunteer[name].indexOf(element);
			if (i === -1) {
				self.volunteer[name].push(element);
			} else {
				self.volunteer[name].splice(i, 1);
			}
		};

		self.generateForm = function() {
			var cRows = _.maxBy(self.fields, 'row').row, cCols = 4;
			var r, cSkip = 0;
			var emptyCell = { status: 'empty' };
			var skipCell = { status: 'skip' };

			var dynamicForm = [];

			// Limit to available sections of volunteer Questionnaire
			self.filteredSections = _.sortBy(_.filter(self.sections, {'questionnaire': { 'identifier': 'qVolunteers' }}), 'position');

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

		// Create a new volunteer
		self.createNewVolunteer = function() {
			var volunteer = new VolunteerUser({
				lastName: "User",
				firstName: "Nick",
				email: 'user@test.com',
				manualAdd: true
			});
			volunteer.$save(function(response) {
				// Redirect after save
				$state.go('root.editVolunteerAdmin', { volunteerId: response._id });
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
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
