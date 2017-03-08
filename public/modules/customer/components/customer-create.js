import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {selectors} from '../../../store';
import {saveCustomer} from '../../../store/customer';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

const mapStateToThis = state => ({
  user: state.auth.user,
  savingCustomers: selectors.savingCustomers(state),
  saveCustomersError: selectors.saveCustomersError(state),
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  settings: state.settings.data,
});

const mapDispatchToThis = dispatch => ({
  saveCustomer: customer => dispatch(saveCustomer(customer)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

export default angular.module('customer')
  .component('customerCreate', {
    /* @ngInject */
    controller: function($ngRedux, Form) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.prevState = {};
        this.loadedFormData = false;
        this.initialized = false;

        this.formMethods = Form.methods;
        this.loadFormData();
      };

      this.$doCheck = () => {
        // Tried to save customer
        if (this.prevState.savingCustomers && !this.savingCustomers) {
          if (this.savingCustomersError) this.error = this.savingCustomersError;
          else this.push('root.createCustomerUser-success', null, { reload: true });
        }

        // Tried to load form data
        if (this.prevState.loadingFormData && !this.loadingFormData) {
          if (this.loadFormDataError) this.error = this.loadFormDataError;
          else this.loadedFormData = true
        }

        // Set up form if data loaded and not already done
        if (this.loadedFormData && !this.initialized) {
          this.customer = this.user;

          this.customerModel = {
            ...this.customer,
            dateOfBirth: new Date(this.customer.dateOfBirth),
            household: [{
              name: this.customer.displayName,
              relationship: 'Applicant'
            }],
            foodPreferences: this.customer.foodPreferences || []
          };

          this.customerForm = this.formMethods.generate(this.customerModel,
                                      this.formData, 'qClients');

          this.initialized = true;
        }

        this.prevState = {...this};
      };

      this.$onDestroy = () => this.unsubscribe();

      // Set an array of dependants based on input value
      this.setDependantList = numberOfDependants => {
        var temp = angular.copy(this.customerModel.household);
        this.customerModel.household = [];
        for (var i = numberOfDependants - 1; i >= 0; i--) {
          this.customerModel.household[i] = temp[i] || {};
          this.customerModel.household[i].dateOfBirth =
            new Date(this.customerModel.household[i].dateOfBirth);
        }
      };

      // Add up totals in Financial Assessment
      this.total = (data, type) =>
        data && data.reduce((a, b) => a + b[type], 0);
    },
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header text-center">
        <foodbank-logo />
        <h1>Client Request for Assistance Application</h1>
        <div class="alert alert-info text-left top-buffer">
          <h4><i class="icon fa fa-warning"></i>Please fill out the following form</h4>
          Once submitted, your application will be reviewed and you will be contacted directly.
          To check on your application status, you may call our client intake line at {{$ctrl.settings.clientIntakeNumber}}.
          For assistance with this application, please contact our support line at {{$ctrl.settings.supportNumber}}.
        </div>
      </section><!-- /.content-header -->
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <!-- Form -->
            <form name="customerForm" data-ng-submit="$ctrl.saveCustomer($ctrl.customerModel)" novalidate>
              <!-- Dynamic Form -->
              <dynamic-form
                section-names="$ctrl.customerForm.sectionNames"
                dyn-form="$ctrl.customerForm.dynForm"
                dyn-type="$ctrl.customerModel"
                food-list="$ctrl.foodList"
                is-checked="$ctrl.formMethods.isChecked(dynType, cellName, choice)"
                handle-checkbox="$ctrl.formMethods.handleCheckbox(dynType, cellName, choice)"
                food-is-checked="$ctrl.formMethodsfoodIsChecked(dynType, food)"
                toggle-food-selection="$ctrl.formMethodstoggleFoodSelection(dynType, food)"
              />

              <!-- TO BE REPLACED ONCE THE NEEDED FIELD TYPE IS IMPLEMENTED -->
              <!-- Section E - Dependants and People in Household -->
              <household
                number-of-dependants="$ctrl.customerModel.household.length"
                dependants="$ctrl.customerModel.household"
                set-dependant-list="$ctrl.setDependantList(num)"
              ></household>

              <!-- Section F - Client Release and Waiver of Liability -->
              <waiver
                customer="$ctrl.customerModel"
                organization="$ctrl.settings.organization"
              ></waiver>
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
              </div>
            </form><!-- form -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.main-content -->
    `
  })
  .name;
