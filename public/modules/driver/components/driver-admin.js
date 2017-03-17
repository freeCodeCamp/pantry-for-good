import angular from 'angular';

import {selectors} from 'store';
import {loadVolunteers} from 'store/volunteer';

const mapStateToThis = state => ({
  drivers: selectors.getAllVolunteers(state).filter(vol =>
    vol.driver && vol.status === 'Active'),
  loading: selectors.loadingVolunteers(state)
});

const mapDispatchToThis = dispatch => ({
  loadVolunteers: () => dispatch(loadVolunteers())
});

export default angular.module('driver')
  .component('driverAdmin', {
    controller: function($ngRedux) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);

        this.loadVolunteers();
      };

      this.$onDestroy = () => this.unsubscribe();
    },
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1>Drivers</h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <!-- Box -->
            <div class="box" st-table="$ctrl.driversCopy" st-safe-src="$ctrl.drivers">
              <!-- Box header -->
              <div class="box-header">
                <h3 class="box-title"></h3>
                <div class="box-tools">
                  <div class="form-group has-feedback">
                    <input class="form-control" type="search" st-search="fullName" placeholder="Search">
                    <span class="glyphicon glyphicon-search form-control-feedback"></span>
                  </div>
                </div>
              </div><!-- /.box-header -->
              <!-- Box body -->
              <div class="box-body table-responsive no-padding top-buffer">
                <!-- Table -->
                <table class="table table-striped table-bordered">
                  <!-- Table columns -->
                  <thead>
                    <tr>
                      <th st-sort="id">ID</th>
                      <th st-sort="fullName">Full Name</th>
                      <th st-sort="deliveryStatus">Delivery Status</th>
                      <th>General Notes</th>
                    </tr>
                  </thead><!-- /.table-columns -->
                  <!-- Table body -->
                  <tbody>
                    <tr data-ng-repeat="driver in $ctrl.driversCopy">
                      <td><span data-ng-bind="driver.id"></span></td>
                      <td><span data-ng-bind="driver.fullName"></span></td>
                      <td><span class="label" data-ng-bind="driver.deliveryStatus" data-ng-class="{
                      'label-success': driver.deliveryStatus === 'Completed',
                      'label-warning': driver.deliveryStatus === 'In progress'
                      }"></span></td>
                      <td><span data-ng-bind="driver.generalNotes"></span></td>
                    </tr>
                    <tr data-ng-if="!$ctrl.drivers.length">
                      <td class="text-center" colspan="4">No drivers yet.</td>
                    </tr>
                  </tbody><!-- /.table-body -->
                </table><!-- /.table -->
              </div><!-- /.box-body -->
              <div class="overlay" ng-show="$ctrl.loading">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div><!-- /.box -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.content -->
    `
  })
  .name;
