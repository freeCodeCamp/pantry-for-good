import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {loadCustomer, saveCustomer, selectors as customerSelectors} from '../../../store/customer';
import {loadFoods} from '../../../store/food-category';
import {loadQuestionnaires} from '../../../store/questionnaire';
import {loadSections, selectors as sectionSelectors} from '../../../store/section';
import {loadFields, selectors as fieldSelectors} from '../../../store/field';
import {selectors as foodItemSelectors} from '../../../store/food-item';

const mapStateToThis = state => ({
  user: state.auth.user,
  savingCustomer: state.customer.saving,
  savingCustomerError: state.customer.saveError,
  getCustomer: id => customerSelectors.getCustomerById(id, state.entities),
  customerId: state.router.currentParams.customerId,
  getFoodItems: () => foodItemSelectors.getAllFoods(state.foodItem.ids, state.entities),
  getFields: () => fieldSelectors.getAllFields(state.field.ids, state.entities),
  getSections: () => sectionSelectors.getAllSections(state.section.ids, state.entities),
});

const mapDispatchToThis = dispatch => ({
  loadCustomer: (id, admin) => dispatch(loadCustomer(id, admin)),
  _saveCustomer: (customer, admin) => dispatch(saveCustomer(customer, admin)),
  loadFoods: () => dispatch(loadFoods()),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  loadFields: () => dispatch(loadFields()),
  loadSections: () => dispatch(loadSections()),
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

export default angular.module('customer')
  .component('customerEdit', {
    /* @ngInject */
    controller: function($ngRedux, Form, formInit) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.loading = false;
        this.loaded = false;
        this.saving = false;
        this.saved = false;
        this.isAdmin = this.user.roles.find(role => role === 'admin');
        this.dynMethods = Form.methods;
      };

      this.$doCheck = () => {
        if (this.saving && !this.savingCustomer) {
          if (this.savingCustomerError) this.error = this.savingCustomerError;
          else this.push(this.isAdmin ? 'root.listCustomers' : 'root');
        }

        if (!this.loaded) {
          this.customer = this.getCustomer(this.customerId);
          // roughly when everything is loaded, should add loaded flags to store or better manual tracking
          if (this.customer &&
              this.getFields().length &&
              this.getSections().length &&
              this.getFoodItems().length) {
            const {household} = this.customer || [];
            this.foodList = this.getFoodItems();
            this.sectionNames = this.getSections();

            // set up form model and generate form
            this.customerModel = {
              ...this.customer,
              dateOfBirth: new Date(this.customer.dateOfBirth),
              household: household.map(dependent => ({
                ...dependent,
                dateOfBirth: new Date(dependent.dateOfBirth)
              })),
              foodPreferences: this.customer.foodPreferences || []
            };

            formInit.get().then(res => {
              const init = this.dynMethods.generate(this.customerModel, res, 'qClients');
              this.dynForm = init.dynForm;
            });

            this.loaded = true;
          }
        }

        // skip if not ready or already loaded
        if (!this.customerId || this.loading || this.loaded) return;
        // only admin can view other users
        if (!this.isAdmin && this.user._id !== Number(this.customerId)) return this.push('root.403');

        this.loadCustomer(this.customerId, this.isAdmin);
        this.loadFoods();
        this.loadQuestionnaires();
        this.loadFields();
        this.loadSections();
        this.loading = true;
      }

      this.$onDestroy = () => this.unsubscribe();

      this.saveCustomer = () => {
        this.saving = true;
        this._saveCustomer(this.customerModel, this.isAdmin);
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
                section-names="$ctrl.sectionNames"
                dyn-form="$ctrl.dynForm"
                dyn-type="$ctrl.customerModel"
                food-list="$ctrl.foodList"
                is-checked="$ctrl.dynMethods.isChecked(dynType, cellName, choice)"
                handle-checkbox="$ctrl.dynMethods.handleCheckbox(dynType, cellName, choice)"
                food-is-checked="$ctrl.dynMethods.foodIsChecked(dynType, food)"
                toggle-food-selection="$ctrl.dynMethods.toggleFoodSelection(dynType, food)"
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
