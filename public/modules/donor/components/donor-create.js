import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {selectors} from '../../../store';
import {saveDonor} from '../../../store/donor';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

const mapStateToThis = state => ({
  user: state.auth.user,
  savingDonors: selectors.savingDonors(state),
  saveDonorsError: selectors.saveDonorsError(state),
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  settings: state.settings.data,
});

const mapDispatchToThis = dispatch => ({
  saveDonor: donor => dispatch(saveDonor(donor)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

export default angular.module('donor')
  .component('donorCreate', {
    controller: function($ngRedux, Form) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.prevState = {};
        this.loadedFormData = false;
        this.initialized = false;

        // Redirect to edit if user has already applied
        if (this.user.hasApplied && $state.is('root.createDonorUser'))
				  this.push('root.editDonorUser', { donorId: this.user._id });

        this.formMethods = Form.methods;
        this.loadFormData();
      };

      this.$doCheck = () => {
        // Tried to save donor
        if (this.prevState.savingDonors && !this.savingDonors) {
          if (this.savingDonorsError) this.error = this.savingDonorsError;
          else this.push('root.createDonorUser-success', null, { reload: true });
        }

        // Tried to load form data
        if (this.prevState.loadingFormData && !this.loadingFormData) {
          if (this.loadFormDataError) this.error = this.loadFormDataError;
          else this.loadedFormData = true
        }


        if (this.loadedFormData && !this.initialized) {
          this.donor = this.user;

          this.donorModel = {...this.donor};

          this.donorForm = this.formMethods.generate(this.donorModel,
                                              this.formData, 'qDonors');
          this.initialized = true;
        }

        this.prevState = {...this};
      };

      this.$onDestroy = () => this.unsubscribe();
    },
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header text-center">
        <foodbank-logo />
        <h1>Donor Profile Creation</h1>
        <br>
        <div class="alert alert-info text-left">
          <i class="icon fa fa-warning"></i>For assistance with this application, please contact our support line at
          {{$ctrl.settings.supportNumber}}.
        </div>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <!-- Form -->
            <form name="donorForm" data-ng-submit="$ctrl.saveDonor($ctrl.donorModel)">

              <!-- Dynamic Form -->
              <dynamic-form
                section-names="$ctrl.donorForm.sectionNames"
                dyn-form="$ctrl.donorForm.dynForm"
                dyn-type="$ctrl.donorModel"
                food-list="$ctrl.donorForm.foodList"
                is-checked="$ctrl.formMethods.isChecked(dynType, cellName, choice)"
                handle-checkbox="$ctrl.formMethods.handleCheckbox(dynType, cellName, choice)"
                food-is-checked="$ctrl.formMethods.foodIsChecked(dynType, food)"
                toggle-food-selection="$ctrl.formMethods.toggleFoodSelection(dynType, food)"
              />

              <!-- Buttons -->
              <div class="row">
                <div class="col-sm-6 col-md-4 col-lg-2">
                  <button type="submit" class="btn btn-success btn-block top-buffer">Submit</button>
                </div>
                <div class="col-sm-6 col-md-4 col-lg-2">
                  <a class="btn btn-primary btn-block top-buffer" data-ng-href="/#!/">Cancel</a>
                </div>
              </div><!-- /.buttons -->
              <!-- Error -->
              <div data-ng-show="$ctrl.error" class="text-danger">
                <strong data-ng-bind="$ctrl.error"></strong>
              </div><!-- /.error -->
            </form><!-- /.form -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.main-content -->
    `
  })
  .name;
