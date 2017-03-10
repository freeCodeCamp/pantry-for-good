import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {selectors} from '../../../store';
import {loadDonor, saveDonor} from '../../../store/donor';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

const mapStateToThis = state => ({
  user: state.auth.user,
  savingDonors: selectors.savingDonors(state),
  saveDonorsError: selectors.saveDonorsError(state),
  loadingDonors: selectors.loadingDonors(state),
  loadDonorsError: selectors.loadDonorsError(state),
  getDonor: selectors.getOneDonor(state),
  donorId: state.router.currentParams.donorId,
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state)
});

const mapDispatchToThis = dispatch => ({
  loadDonor: (id, admin) => dispatch(loadDonor(id, admin)),
  _saveDonor: (donor, admin) => dispatch(saveDonor(donor, admin)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

export default angular.module('donor')
  .component('donorEdit', {
    controller: function($ngRedux, Form) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.prevState = {};
        this.loadedFormData = false;
        this.initialized = false;

        this.isAdmin = this.user.roles.find(role => role === 'admin');
        this.formMethods = Form.methods;

        this.loadDonor(this.donorId, this.isAdmin);
        this.loadFormData();
      };

      this.$doCheck = () => {
        // Tried to save donor
        if (!this.savingDonors && this.prevState.savingDonors) {
          if (this.saveDonorsError) this.error = this.saveDonorsError;
          else this.push(this.isAdmin ? 'root.listDonors' : 'root');
        }

        // Tried to load donor
        if (!this.loadingDonors && this.prevState.loadingDonors) {
          if (this.loadDonorsError) this.error = this.loadDonorsError;
          else this.donor = this.getDonor(this.donorId);
        }

        // Tried to load form data
        if (!this.loadingFormData && this.prevState.loadingFormData) {
          if (this.loadFormDataError) this.error = this.loadFormDataError;
          else this.loadedFormData = true;
        }

        // Set up form if data loaded and not already done
        if (this.donor && this.loadedFormData && !this.initialized) {
          this.donorModel = {
            ...this.donor,
            dateOfBirth: new Date(this.donor.dateOfBirth),
            foodPreferences: this.donor.foodPreferences || []
          };

          this.donorForm = this.formMethods.generate(this.donorModel,
                                      this.formData, 'qClients');

          this.initialized = true;
        }

        this.prevState = {...this};
      };

      this.saveDonor = donor => this._saveDonor(donor, this.isAdmin);

      this.$onDestroy = () => this.unsubscribe();
    },
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1>{{$ctrl.donor.firstName}} {{$ctrl.donor.lastName}}</h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <!-- Form -->
            <form name="donorForm" data-ng-submit="$ctrl.saveDonor($ctrl.donorModel)">
              <!-- Identification and General Information -->
              <dynamic-form
                section-names="$ctrl.donorForm.sectionNames"
                dyn-form="$ctrl.donorForm.dynForm"
                dyn-type="$ctrl.donor"
                food-list="$ctrl.donorForm.foodList"
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
                  <a class="btn btn-primary btn-block top-buffer" data-ng-if="$ctrl.isAdmin" data-ng-href="/#!/admin/donors">Cancel</a>
                  <a class="btn btn-primary btn-block top-buffer" data-ng-if="!$ctrl.isAdmin" data-ng-href="/#!/">Cancel</a>
                </div>
              </div><!-- /.buttons -->
              <!-- Error -->
              <div data-ng-show="$ctrl.error" class="text-danger">
                <strong data-ng-bind="$ctrl.error"></strong>
              </div><!-- /.error -->
            </form><!-- /.form -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.content -->
    `
  })
  .name;
