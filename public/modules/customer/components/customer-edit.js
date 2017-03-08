import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {selectors} from '../../../store';
import {loadCustomer, saveCustomer} from '../../../store/customer';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

const mapStateToThis = state => ({
  user: state.auth.user,
  savingCustomers: selectors.savingCustomers(state),
  saveCustomersError: selectors.saveCustomersError(state),
  loadingCustomers: selectors.loadingCustomers(state),
  loadCustomersError: selectors.loadCustomersError(state),
  getCustomer: selectors.getOneCustomer(state),
  customerId: state.router.currentParams.customerId,
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state)
});

const mapDispatchToThis = dispatch => ({
  loadCustomer: (id, admin) => dispatch(loadCustomer(id, admin)),
  _saveCustomer: (customer, admin) => dispatch(saveCustomer(customer, admin)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

export default angular.module('customer')
  .component('customerEdit', {
    /* @ngInject */
    controller: function($ngRedux, Form) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.prevState = {};
        this.loadedFormData = false;
        this.initialized = false;

        this.isAdmin = this.user.roles.find(role => role === 'admin');
        this.formMethods = Form.methods;

        this.loadCustomer(this.customerId, this.isAdmin);
        this.loadFormData();
      };

      this.$doCheck = () => {
        // Tried to save customer
        if (!this.savingCustomers && this.prevState.savingCustomers) {
          if (this.saveCustomersError) this.error = this.saveCustomersError;
          else this.push(this.isAdmin ? 'root.listCustomers' : 'root');
        }

        // Tried to load customer
        if (!this.loadingCustomers && this.prevState.loadingCustomers) {
          if (this.loadCustomersError) this.error = this.loadCustomersError;
          else this.customer = this.getCustomer(this.customerId);
        }

        // Tried to load form data
        if (!this.loadingFormData && this.prevState.loadingFormData) {
          if (this.loadFormDataError) this.error = this.loadFormDataError;
          else this.loadedFormData = true;
        }

        // Set up form if data loaded and not already done
        if (this.customer && this.loadedFormData && !this.initialized) {
          const {household} = this.customer || [];

          this.customerModel = {
            ...this.customer,
            dateOfBirth: new Date(this.customer.dateOfBirth),
            household: household.map(dependent => ({
              ...dependent,
              dateOfBirth: new Date(dependent.dateOfBirth)
            })),
            foodPreferences: this.customer.foodPreferences || []
          };

          this.customerForm = this.formMethods.generate(this.customerModel,
                                      this.formData, 'qClients');

          this.initialized = true;
        }

        this.prevState = {...this};
      };

      this.$onDestroy = () => this.unsubscribe();

      this.saveCustomer = () =>
        this._saveCustomer(this.customerModel, this.isAdmin);

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
      <section class="content-header">
        <h1><span data-ng-bind="$ctrl.customer.fullName"></span></h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <!-- Form -->
            <form name="dynTypeForm" data-ng-submit="dynTypeForm.$valid && $ctrl.saveCustomer()">
              <dynamic-form
                section-names="$ctrl.customerForm.sectionNames"
                dyn-form="$ctrl.customerForm.dynForm"
                dyn-type="$ctrl.customerModel"
                food-list="$ctrl.customerForm.foodList"
                is-checked="$ctrl.formMethods.isChecked(dynType, cellName, choice)"
                handle-checkbox="$ctrl.formMethods.handleCheckbox(dynType, cellName, choice)"
                food-is-checked="$ctrl.formMethods.foodIsChecked(dynType, food)"
                toggle-food-selection="$ctrl.formMethods.toggleFoodSelection(dynType, food)"
              />

              <!-- TO BE REPLACED ONCE THE NEEDED FIELD TYPE IS IMPLEMENTED -->
              <!-- Section E - Dependants and people in household -->
              <household
                number-of-dependants="$ctrl.customerModel.household.length"
                dependants="$ctrl.customerModel.household"
                set-dependant-list="$ctrl.setDependantList(num)"
              ></household>
              <!-- Buttons -->
              <div class="row">
                <div class="col-sm-6 col-md-4 col-lg-2">
                  <button type="submit" class="btn btn-success btn-block top-buffer">Update</button>
                </div>
                <div class="col-sm-6 col-md-4 col-lg-2">
                  <a class="btn btn-primary btn-block top-buffer" data-ng-if="$ctrl.isAdmin" data-ng-href="/#!/admin/customers">Cancel</a>
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
