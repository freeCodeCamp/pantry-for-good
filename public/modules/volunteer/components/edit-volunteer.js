import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {selectors} from '../../../store';
import {loadVolunteer, saveVolunteer} from '../../../store/volunteer';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

const mapStateToThis = state => ({
  user: state.auth.user,
  getVolunteer: selectors.getOneVolunteer(state),
  loadingVolunteers: selectors.loadingVolunteers(state),
  loadVolunteersError: selectors.loadVolunteersError(state),
  savingVolunteers: selectors.savingVolunteers(state),
  saveVolunteersError: selectors.saveVolunteersError(state),
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  volunteerId: state.router.currentParams.volunteerId,
  settings: state.settings.data,
});

const mapDispatchToThis = dispatch => ({
  loadVolunteer: (id, admin) => dispatch(loadVolunteer(id, admin)),
  _saveVolunteer: (volunteer, admin) => dispatch(saveVolunteer(volunteer, admin)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

export default angular.module('volunteer')
  .component('editVolunteer', {
    controller: function($ngRedux, Form) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.prevState = {};
        this.loadedFormData = false;
        this.initialized = false;

        this.isAdmin = this.user.roles.find(role => role === 'admin');
        this.formMethods = Form.methods;

        this.loadVolunteer(this.volunteerId, this.isAdmin);
        this.loadFormData();
      };

      this.$doCheck = () => {
        // Tried to save volunteer
        if (this.prevState.savingVolunteers && !this.savingVolunteers) {
          if (this.savingVolunteersError) this.error = this.savingVolunteersError;
          else this.push(this.isAdmin ? 'root.listVolunteers' : 'root');
        }

        // Tried to load volunteer
        if (this.prevState.loadingVolunteers && !this.loadingVolunteers) {
          if (this.loadVolunteersError) this.error = this.loadVolunteersError;
          else this.volunteer = this.getVolunteer(this.volunteerId);
        }

        // Tried to load form data
        if (this.prevState.loadingFormData && !this.loadingFormData) {
          if (this.loadFormDataError) this.error = this.loadFormDataError;
          else this.loadedFormData = true
        }

        // Set up form if data loaded and not already done
        if (!this.initialized && this.loadedFormData && this.volunteer) {
          console.log('this.volunteer.dateOfBirth', this.volunteer.dateOfBirth)

          this.volunteerModel = {
            ...this.volunteer,
            dateOfBirth: new Date(this.volunteer.dateOfBirth)
          };

          this.volunteerForm = this.formMethods.generate(this.volunteerModel,
                                      this.formData, 'qVolunteers');

          this.initialized = true;
        }

        this.prevState = {...this};
      };

      this.$onDestroy = () => this.unsubscribe();

      this.saveVolunteer = () => this._saveVolunteer(this.volunteer, this.isAdmin);
    },
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1>{{$ctrl.volunteer.firstName}} {{$ctrl.volunteer.lastName}}</h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <!-- Form -->
            <form name="volunteerForm" data-ng-submit="volunteerForm.$valid && $ctrl.saveVolunteer()">
              <!-- Identification and General Information -->
              <dynamic-form
                section-names="$ctrl.volunteerForm.sections"
                dyn-form="$ctrl.volunteerForm.dynForm"
                dyn-type="$ctrl.volunteerModel"
                food-list="$ctrl.volunteerForm.foods"
                is-checked="$ctrl.formMethods.isChecked(dynType, cellName, choice)"
                handle-checkbox="$ctrl.formMethods.handleCheckbox(dynType, cellName, choice)"
                food-is-checked="$ctrl.formMethods.foodIsChecked(dynType, food)"
                toggle-food-selection="$ctrl.formMethods.toggleFoodSelection(dynType, food)"
              />
              <!-- Buttons -->
              <div class="row">
                <div class="col-sm-6 col-md-4 col-lg-2">
                  <button type="submit" class="btn btn-success btn-block top-buffer">Update</button>
                </div>
                <div class="col-sm-6 col-md-4 col-lg-2">
                  <a class="btn btn-primary btn-block top-buffer" data-ng-if="$ctrl.isAdmin" data-ng-href="/#!/admin/volunteers">Cancel</a>
                  <a class="btn btn-primary btn-block top-buffer" data-ng-if="!$ctrl.isAdmin" data-ng-href="/#!/">Cancel</a>
                </div>
              </div><!-- /.buttons -->
              <!-- Error -->
              <div data-ng-show="$ctrl.error" class="text-danger">
                <strong data-ng-bind="$ctrl.error"></strong>
              </div>
            </form><!-- /.form -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.content -->
    `
  })
  .name;
