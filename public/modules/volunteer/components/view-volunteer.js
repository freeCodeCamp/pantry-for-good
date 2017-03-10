import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {selectors} from '../../../store';
import {loadVolunteer, saveVolunteer, deleteVolunteer} from '../../../store/volunteer';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

const mapStateToThis = state => ({
  user: state.auth.user,
  savingVolunteer: state.volunteer.saving,
  saveVolunteersError: state.volunteer.saveError,
  loadingVolunteers: selectors.loadingVolunteers(state),
  loadVolunteersError: selectors.loadVolunteersError(state),
  getVolunteer: selectors.getOneVolunteer(state),
  volunteerId: state.router.currentParams.volunteerId,
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state)
});

const mapDispatchToThis = dispatch => ({
  loadVolunteer: (id, admin) => dispatch(loadVolunteer(id, admin)),
  _saveVolunteer: (volunteer, admin) => dispatch(saveVolunteer(volunteer, admin)),
  deleteVolunteer: volunteer => dispatch(deleteVolunteer(volunteer.id)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

export default angular.module('volunteer')
  .component('viewVolunteer', {
    controller: function($ngRedux, View) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.prevState = {};
        this.loadedFormData = false;
        this.initialized = false;

        this.isAdmin = this.user.roles.find(role => role === 'admin');
        this.viewMethods = View.methods;

        // Only admin should be able to view other volunteers
        if (!this.isAdmin && this.user._id !== Number(this.volunteerId))
          return this.push('root.403');

        this.loadVolunteer(this.volunteerId, this.isAdmin);
        this.loadFormData();
      };

      this.$doCheck = () => {
        // Tried to save volunteer
        if (!this.savingVolunteers && this.prevState.savingVolunteers) {
          if (this.savingVolunteerError) this.error = this.savingVolunteerError;
          else this.error = null;
        }

        // Tried to load volunteer
        if (!this.loadingVolunteers && this.prevState.loadingVolunteers) {
          if (this.loadVolunteersError) this.error = this.loadVolunteersError;
          else this.volunteer = this.getVolunteer(this.volunteerId);
        }

        // Tried to load form data
        if (!this.loadingFormData && this.prevState.loadingFormData) {
          if (this.loadFormDataError) this.error = this.loadFormDataError;
          else this.loadedFormData = true;
        }

        if (this.volunteer && this.loadedFormData && !this.initialized) {
          // this.foodPreferences = this.getFoodPreferences();
          this.volunteerView = this.viewMethods.generate(this.volunteer,
                                                    this.formData, 'qVolunteers');

          this.initialized = true;
        }

        this.prevState = {...this};
      }

      this.$onDestroy = () => this.unsubscribe();

      this.saveVolunteer = status =>
        this._saveVolunteer({
          ...this.volunteer,
          status: status === 'Driver' ? 'Active' : status,
          driver: status === 'Driver'
        }, this.isAdmin);
    },
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1><span data-ng-bind="$ctrl.volunteer.fullName"></span></h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">

            <dynamic-view dyn-form="$ctrl.volunteerView.dynForm" section-names="$ctrl.volunteerView.sectionNames" />

            <div class="form-group" data-ng-show="$ctrl.isAdmin">
              <a class="btn btn-warning" data-ng-click="$ctrl.saveVolunteer('Driver')">Driver</a>
              <a class="btn btn-success" data-ng-click="$ctrl.saveVolunteer('Active')">Active</a>
              <a class="btn btn-danger" data-ng-click="$ctrl.saveVolunteer('Inactive')">Inactive</a>
              <a class="btn btn-danger" data-ng-click="$ctrl.deleteVolunteer($ctrl.volunteer)">Delete</a>
              <a class="btn btn-primary" data-ng-href="/#!/admin/volunteers/{{$ctrl.volunteer.id}}/edit">Edit</a>
              <a class="btn btn-primary" data-ng-href="/#!/admin/volunteers">Cancel</a>
            </div>
            <div class="form-group" data-ng-show="!$ctrl.isAdmin">
              <a class="btn btn-primary" data-ng-href="/#!/volunteer/{{$ctrl.volunteer.id}}/edit">Edit</a>
              <a class="btn btn-primary" data-ng-href="/#!/">Cancel</a>
            </div>
          </div><!-- /.col -->
        </div><!-- /.row -->
        <div data-ng-show="$ctrl.error" class="text-danger">
          <strong data-ng-bind="$ctrl.error"></strong>
        </div>
      </section><!-- /.content -->
    `
  })
  .name;
