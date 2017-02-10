import angular from 'angular';
import moment from 'moment';
import {stateGo} from 'redux-ui-router';

const mapStateToThis = state => ({
	auth: state.auth,
	settings: state.settings.data
});

const mapDispatchToThis = dispatch => ({
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

angular.module('volunteer').controller('VolunteerController', VolunteerController);

/* @ngInject */
function VolunteerController($window, $stateParams, $state, Authentication, VolunteerAdmin,
														VolunteerUser, Form, View, formInit, $ngRedux) {

	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);

		this.user = this.auth.user;
		const user = this.user;
		const isAdmin = user && user.roles.indexOf('admin') !== -1;

		if (isAdmin) {
			// Use formInit service to load sections and fields from db
			// If on edit view, use Form service to create dynamic form from questionnaire editor
			if ($state.current.name === 'root.editVolunteerAdmin') {
				this.dynMethods = Form.methods;
			} else if ($state.current.name === 'root.viewVolunteerAdmin') {
				this.dynMethods = View.methods;
			}

			if ($state.current.name === 'root.editVolunteerAdmin' || $state.current.name ===  'root.viewVolunteerAdmin') {
				formInit.get().then(function(res) {
					var init = this.dynMethods.generate(this.dynType, res, 'qVolunteers');
					this.dynForm = init.dynForm;
					this.sectionNames = init.sectionNames;
					this.foodList = init.foodList;
				});
			}

			// Add plugins into datatable
			this.dtOptions = {
				dom: 'Tlfrtip',
				tableTools: {
					sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
					aButtons: ['copy', 'xls']
				}
			};

			// Find a list of volunteers
			this.find = () => {
				this.volunteers = VolunteerAdmin.query();
			};

			// Delete volunteer
			this.delete = volunteer => {
				if ($window.confirm('Are you sure?')) {
					volunteer.$delete(() => {
						this.push('root.listVolunteers', null, { reload: true });
					}, errorResponse => {
						this.error = errorResponse.data.message;
					});
				}
			};
		} else if (user.hasApplied && $state.is('root.createVolunteerUser')) {
			$state.go('root.editVolunteerUser', { volunteerId: user._id });
		} else {
			// Populate volunteer object if the user has filled an application
			this.dynType = Authentication.user;

			this.dynMethods = Form.methods;
			formInit.get().then(function(res) {
				var init = this.dynMethods.generate(this.dynType, res, 'qVolunteers');
				this.dynForm = init.dynForm;
				this.sectionNames = init.sectionNames;
				this.foodList = init.foodList;
			});

			// Helper method to determine the volunteer's age
			this.isMinor = function(dateOfBirth) {
				return moment().diff(dateOfBirth, 'years') < 18;
			};

			// Create a new volunteer
			this.create = () => {
				let volunteer = new VolunteerUser(this.dynType);
				delete volunteer._id;
				this.dynType.hasApplied = true;

				volunteer.$save(() => {
					// Redirect after save
					this.push('root.createVolunteerUser-success', null, { reload: true });
				}, errorResponse => {
					this.error = errorResponse.data.message;
				});
			};
		}

		// Common

		// Find existing volunteer
		this.findOne = () => {
			const VolunteerService = isAdmin ? VolunteerAdmin : VolunteerUser;
			this.volunteer = VolunteerService.get({
				volunteerId: $stateParams.volunteerId
			}, volunteer => {
				this.volunteer.dateOfBirth = new Date(volunteer.dateOfBirth);
			});
		};

		// Update existing volunteer
		this.update = updateType => {
			var volunteer = this.volunteer;

			if (isAdmin) {
				if (updateType === 'Driver') {
					volunteer.driver = true;
				} else if (updateType === 'Inactive') {
					volunteer.status = updateType;
					volunteer.driver = false;
				} else {
					volunteer.status = updateType;
				}
			}

			volunteer.$update(() => {
				// Redirect after save
				this.push(isAdmin ? 'root.listVolunteers' : 'root');
			}, errorResponse => {
				this.error = errorResponse.data.message;
			});
		};
	};

	this.$onDestroy = () => this.unsubscribe();
}
