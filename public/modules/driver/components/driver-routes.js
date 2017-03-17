import angular from 'angular';

import {selectors} from 'store';
import {loadCustomers} from 'store/customer';
import {loadVolunteers} from 'store/volunteer';

const mapStateToThis = state => ({
  _customers: selectors.getAllCustomers(state),
  _drivers: selectors.getAllVolunteers(state).filter(vol =>
    vol.driver && vol.status === 'Active'),
  loading: selectors.loadingVolunteers(state) || selectors.loadingCustomers(state),
  error: selectors.loadCustomersError(state) || selectors.loadVolunteersError(state)
});

const mapDispatchToThis = dispatch => ({
  loadCustomers : () => dispatch(loadCustomers()),
  loadVolunteers: () => dispatch(loadVolunteers())
});

export default angular.module('driver')
  .component('driverRoutes', {
    controller: function($ngRedux) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.loadCustomers();
        this.loadVolunteers();
        this.prevState = {};
      };

      this.$doCheck = () => {
        if (!this.loading && this.prevState.loading) {
          this.customers = [...this._customers];
        }
      };

      this.$onDestroy = () => this.unsubscribe();
    },
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1>Route Assignment</h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-md-6">
            <!-- Box -->
            <div class="box box-success">
              <!-- Box header -->
              <div class="box-header">
                <h3 class="box-title">Clients</h3>
              </div><!-- /.box-header -->
              <!-- Box body -->
              <div class="box-body table-responsive no-padding">
                <!-- Table -->
                <table class="table table-striped table-bordered" st-table="$ctrl.customers">
                  <!-- Table columns -->
                  <thead>
                    <tr>
                      <th>Assigned To</th>
                      <th st-sort="id">Client ID</th>
                      <th>Full Address</th>
                      <th>Delivery Instructions</th>
                    </tr>
                  </thead><!-- /.table-columns
                  <!-- Table body -->
                  <tbody>
                    <tr ng-class="{active: customer.isChecked}" data-ng-repeat="customer in $ctrl.customers">
                      <td><span data-ng-bind="customer.assignedTo.fullName"></span></td>
                      <td><span data-ng-bind="customer.id"></span></td>
                      <td><span data-ng-bind="customer.fullAddress"></span></td>
                      <td><span data-ng-bind="customer.deliveryInstructions"></span></td>
                    </tr>
                    <tr data-ng-if="!$ctrl.customers.length">
                      <td class="text-center" colspan="4">There are no clients to be assigned.</td>
                    </tr>
                  </tbody><!-- /.table-body -->
                </table><!-- /.table -->
              </div><!-- /.box-body -->
              <!-- Box footer -->
              <div class="box-footer">
                <form name="assignForm" data-ng-submit="$ctrl.assign()">
                  <div class="input-group">
                    <select class="form-control"
                            ng-options="driver.fullName for driver in $ctrl.drivers"
                            data-ng-model="$ctrl.driver"
                            required>
                      <option value="">Select driver</option>
                    </select>
                      <span class="input-group-btn">
                        <button class="btn btn-success btn-flat" type="submit" data-ng-disabled="$ctrl.isDisabled(assignForm)">
                          Assign
                        </button>
                      </span>
                  </div>
                </form>
              </div><!-- /.box-footer -->
              <div class="overlay" ng-show="$ctrl.isLoading">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div><!-- /.box -->
          </div><!-- /.col -->
          <div class="col-md-6">
            <!-- Box -->
            <div class="box box-primary">
              <!-- Box header -->
              <div class="box-header">
                <h3 class="box-title">Google Maps</h3>
              </div><!-- /.box-header -->
              <!-- Box body -->
              <div class="box-body no-padding">
                <!-- Google map -->
                <div class="googleMap"></div>
                <!-- /.Google map -->
              </div><!-- /.box-body -->
              <div class="overlay" ng-show="$ctrl.isLoading">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div><!-- /.box -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.content -->
    `
  })
  .name;
