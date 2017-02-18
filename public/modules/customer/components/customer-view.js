import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {
  loadCustomer,
  saveCustomer,
  deleteCustomer,
  selectors as customerSelectors
} from '../../../store/customer';
import {loadFoods} from '../../../store/food-category';

const mapStateToThis = state => ({
  user: state.auth.user,
  savingCustomer: state.customer.saving,
  savingCustomerError: state.customer.saveError,
  getCustomer: id => customerSelectors.getCustomerById(id, state.entities),
  customerId: state.router.currentParams.customerId,
});

const mapDispatchToThis = dispatch => ({
  loadCustomer: (id, admin) => dispatch(loadCustomer(id, admin)),
  _saveCustomer: (customer, admin) => dispatch(saveCustomer(customer, admin)),
  deleteCustomer: id => dispatch(deleteCustomer(id)),
  loadFoods: () => dispatch(loadFoods()),
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

export default angular.module('customer')
  .component('customerView', {
    controller: function($ngRedux, Form, View, formInit) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.loading = false;
        this.loaded = false;
        this.saving = false;
        this.saved = false;
        this.isAdmin = this.user.roles.find(role => role === 'admin');
        this.dynMethods = View.methods;
      };

      this.$doCheck = () => {
        if (this.saving && !this.savingCustomer && this.savingCustomerError)
          this.error = this.savingCustomerError;

        this.customer = this.getCustomer(this.customerId);

        if (!this.loaded && this.customer && this.customer.foodPreferences) {
          this.foodPreferences = this.getFoodPreferences();
          formInit.get().then(res => {
            var init = this.dynMethods.generate(this.customer, res, 'qClients');
            this.dynForm = init.dynForm;
            this.sectionNames = init.sectionNames;
            this.foodList = init.foodList;
          });
          this.loaded = true;
        }

        // skip if not ready or already loaded
        if (!this.customerId || this.loading || this.loaded) return;
        // only admin can view other users
        if (!this.isAdmin && this.user._id !== Number(this.customerId)) return this.push('root.403');

        this.loadCustomer(this.customerId, this.isAdmin);
        this.loadFoods();
        this.loading = true;
      }

      this.$onDestroy = () => this.unsubscribe();

      this.saveCustomer = status => {
        this.saving = true;
        this._saveCustomer({...this.customer, status}, this.isAdmin);
      };

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
            <dynamic-view dyn-form="$ctrl.dynForm" section-names="$ctrl.sectionNames" />

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
                  <tr data-ng-repeat="dependant in $ctrl.dynType.household">
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
