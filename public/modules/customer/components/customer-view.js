import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {selectors} from '../../../store';
import {loadCustomer, saveCustomer, deleteCustomer} from '../../../store/customer';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

const mapStateToThis = state => ({
  user: state.auth.user,
  savingCustomer: state.customer.saving,
  savingCustomerError: state.customer.saveError,
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
  deleteCustomer: id => dispatch(deleteCustomer(id)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

export default angular.module('customer')
  .component('customerView', {
    controller: function($ngRedux, View) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.prevState = {};
        this.loadedFormData = false;
        this.initialized = false;

        this.isAdmin = this.user.roles.find(role => role === 'admin');
        this.viewMethods = View.methods;

        // Only admin should be able to view other customers
        if (!this.isAdmin && this.user._id !== Number(this.customerId))
          return this.push('root.403');

        this.loadCustomer(this.customerId, this.isAdmin);
        this.loadFormData();
      };

      this.$doCheck = () => {
        // Tried to save customer
        if (!this.savingCustomers && this.prevState.savingCustomers) {
          if (this.savingCustomerError) this.error = this.savingCustomerError;
          else this.error = null;
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

        if (this.customer && this.loadedFormData && !this.initialized) {
          this.foodPreferences = this.getFoodPreferences();
          this.customerView = this.viewMethods.generate(this.customer,
                                                    this.formData, 'qClients');

          this.initialized = true;
        }

        this.prevState = {...this};
      }

      this.$onDestroy = () => this.unsubscribe();

      this.saveCustomer = status => this._saveCustomer({...this.customer, status},this.isAdmin);

      this.getFoodPreferences = () => {
        const {foodPreferences, foodPreferencesOther} = this.customer;
        if (Array.isArray(foodPreferences) && foodPreferences.length > 0) {
          console.log('foodPreferences', foodPreferences)
          return `${foodPreferences.filter(item => item && item.name).map(item => item.name).join(', ')}
                  ${foodPreferencesOther ? ', ' + foodPreferencesOther : ''}`;
        } else {
          return foodPreferencesOther;
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
            <!-- Dynamic form, view only -->
            <dynamic-view
              dyn-form="$ctrl.customerView.dynForm"
              section-names="$ctrl.customerView.sectionNames"
            />

            <!--TODO: REPLACE REMAINING STATIC SECTIONS-->
            <div class="box box-solid box-primary">
              <!-- Box header -->
              <div class="box-header">
                <h3 class="box-title">SECTION E - DEPENDANTS AND PEOPLE IN HOUSEHOLD</h3>
              </div><!-- /.box-header-->
              <!-- Box body -->
              <div class="box-body">
                <table class="table-striped table-bordered table-hover table">
                  <tr char="info">
                    <th>Name</th>
                    <th>Relationship</th>
                    <th>Date of Birth</th>
                  </tr>
                  <tr data-ng-repeat="dependant in $ctrl.customer.household">
                    <td>{{dependant.name}}</td>
                    <td>{{dependant.relationship}}</td>
                    <td>{{dependant.dateOfBirth | date: 'mediumDate'}}</td>
                  </tr>
                </table>
              </div><!-- /.box-body -->
            </div><!-- /.box -->
            <div class="form-group" data-ng-if="$ctrl.isAdmin">
              <a class="btn btn-success" data-ng-click="$ctrl.saveCustomer('Accepted')">Accept</a>
              <a class="btn btn-danger" data-ng-click="$ctrl.saveCustomer('Rejected')">Reject</a>
              <a class="btn btn-warning" data-ng-click="$ctrl.saveCustomer('Inactive')">Inactive</a>
              <a class="btn btn-warning" data-ng-click="$ctrl.deleteCustomer($ctrl.customer.id)">Delete</a>
              <a class="btn btn-primary" data-ng-href="/#!/admin/customers/{{$ctrl.customer.id}}/edit">Edit</a>
              <a class="btn btn-primary" data-ng-href="/#!/admin/customers">Cancel</a>
            </div>
            <div class="form-group" data-ng-if="!$ctrl.isAdmin">
              <a class="btn btn-primary" data-ng-href="/#!/customer/{{$ctrl.customer.id}}/edit">Edit</a>
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
