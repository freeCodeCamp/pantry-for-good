import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {saveCustomer} from '../../../store/customer';
import {loadFoods} from '../../../store/food-category';
import {loadQuestionnaires} from '../../../store/questionnaire';
import {loadSections, selectors as sectionSelectors} from '../../../store/section';
import {loadFields, selectors as fieldSelectors} from '../../../store/field';
import {selectors as foodItemSelectors} from '../../../store/food-item';

const mapStateToThis = state => ({
  user: state.auth.user,
  settings: state.settings.data,
  savingCustomer: state.customer.saving,
  savingCustomerError: state.customer.saveError,
  getFoodItems: () => foodItemSelectors.getAllFoods(state.foodItem.ids, state.entities),
  getFields: () => fieldSelectors.getAllFields(state.field.ids, state.entities),
  getSections: () => sectionSelectors.getAllSections(state.section.ids, state.entities),
});

const mapDispatchToThis = dispatch => ({
  _saveCustomer: customer => dispatch(saveCustomer(customer)),
  loadFoods: () => dispatch(loadFoods()),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  loadFields: () => dispatch(loadFields()),
  loadSections: () => dispatch(loadSections()),
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

export default angular.module('customer')
  .component('customerCreate', {
    /* @ngInject */
    controller: function($ngRedux, Form, formInit) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.loading = false;
        this.loaded = false;
        this.saving = false;
        this.saved = false;
        this.dynMethods = Form.methods;
      };

       this.$doCheck = () => {
        if (this.saving && !this.savingCustomer) {
          if (this.savingCustomerError) this.error = this.savingCustomerError;
          else this.push('root.createCustomerUser-success', null, { reload: true });
        }

        if (!this.loaded) {
          // roughly when everything is loaded, should add loaded flags to store or better manual tracking
          if (this.getFields().length &&
              this.getSections().length &&
              this.getFoodItems().length) {
            this.foodList = this.getFoodItems();
            this.sectionNames = this.getSections();

            // set up form model and generate form
            this.customerModel = {
              firstName: this.user.firstName,
              lastName: this.user.lastName,
              email: this.user.email,
              household: [{
                name: `${this.user.firstName} ${this.user.lastName}`,
                relationship: 'Applicant'
              }],
              foodPreferences: []
            };

            formInit.get().then(res => {
              const init = this.dynMethods.generate(this.customerModel, res, 'qClients');
              this.dynForm = init.dynForm;
            });

            this.loaded = true;
          }
        }

        // skip if not ready or already loaded
        if (this.loading || this.loaded) return;

        this.loadFoods();
        this.loadQuestionnaires();
        this.loadFields();
        this.loadSections();
        this.loading = true;
      };

      this.$onDestroy = () => this.unsubscribe();

      this.saveCustomer = customer => {
        this.saving = true;
        this._saveCustomer(customer);
      };

      // Toggle selection of all food items
      this.selectAll = checked =>
        this.customerModel.foodPreferences = checked ? [...this.foodList] : [];

      // Check if food item is selected
      this.foodIsChecked = selectedFood =>
        this.customerModel.foodPreferences.find(food => food._id === selectedFood._id);

      // Store food category when box is checked an remove when unchecked
      this.toggleSelection = selectedFood => {
        if (this.foodIsChecked(selectedFood)) {
          this.customerModel.foodPreferences = this.customerModel.foodPreferences
            .filter(food => food._id !== selectedFood._id)
        } else {
          this.customerModel.foodPreferences = [...this.customerModel.foodPreferences, selectedFood];
        }
      };

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
            <form name="customerForm" data-ng-submit="$ctrl.create()" novalidate>
              <!-- Dynamic Form -->
              <dynamic-form
                section-names="$ctrl.sectionNames"
                dyn-type="$ctrl.customerModel"
                food-list="$ctrl.foodList"
                is-checked="$ctrl.isChecked(dynType, cellName, choice)"
                handle-checkbox="$ctrl.handleCheckbox(dynType, cellName, choice)"
                food-is-checked="$ctrl.foodIsChecked(dynType, food)"
                toggle-food-selection="$ctrl.toggleFoodSelection(dynType, food)"
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
