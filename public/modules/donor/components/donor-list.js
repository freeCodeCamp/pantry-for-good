import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {selectors} from '../../../store';
import {loadDonors, deleteDonor} from '../../../store/donor';

const mapStateToThis = state => ({
  savingDonors: selectors.savingDonors(state),
  saveDonorsError: selectors.saveDonorsError(state),
  loadingDonors: selectors.loadingDonors(state),
  loadDonorsError: selectors.loadDonorsError(state),
  donors: selectors.getAllDonors(state),
});

const mapDispatchToThis = dispatch => ({
  loadDonors: () => dispatch(loadDonors()),
  deleteDonor: donor => dispatch(deleteDonor(donor.id)),
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

export default angular.module('donor')
  .component('donorList', {
    controller: function($ngRedux) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.loadDonors();
      };

      this.totalDonations = donor => {
        if (!donor || !donor.donations) return 0;
        return donor.donations.reduce((acc, x) => acc + x.eligibleForTax || 0, 0);
      };

      this.$onDestroy = () => this.unsubscribe();
    },
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1>Donor Database</h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <div class="box">
              <!-- Box header -->
              <div class="box-header">
                <h3 class="box-title">Applications</h3>
              </div><!-- /.box-header-->
              <!-- Box body -->
              <div class="box-body table-responsive">
                <!-- Data table -->
                <table class="table table-bordered table-striped" datatable="ng" dt-options="$ctrl.dtOptions">
                  <!-- Table columns -->
                  <thead>
                  <tr role="row">
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Total Donated</th>
                    <th>Full Address</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                  </thead><!-- /.table columns -->
                  <!-- Table footer -->
                  <tfoot></tfoot><!-- /.table footer -->
                  <!-- Table content -->
                  <tbody role="alert" aria-live="polite" aria-relevant="all">
                    <tr data-ng-repeat="donor in $ctrl.donors">
                      <td><span data-ng-bind="donor.id"></span></td>
                      <td><span data-ng-bind="donor.fullName"></span></td>
                      <td><span data-ng-bind="$ctrl.totalDonations(donor) | currency:'$':2"></span></td>
                      <td><span data-ng-bind="donor.fullAddress"></span></td>
                      <td><span data-ng-bind="donor.telephoneNumber"></span></td>
                      <td><span data-ng-bind="donor.email"></span></td>
                      <td>
                        <a data-ng-href="/#!/admin/donors/{{donor.id}}" class="btn btn-info btn-flat btn-xs"><i class="fa fa-eye"></i> View</a>
                        <a data-ng-href="/#!/admin/donors/{{donor.id}}/edit" class="btn btn-primary btn-flat btn-xs"><i class="fa fa-pencil"></i> Edit</a>
                        <a data-ng-click="$ctrl.deleteDonor(donor)" class="btn btn-danger btn-flat btn-xs"><i class="fa fa-trash-o"></i> Delete</a>
                      </td>
                    </tr>
                  </tbody><!-- /.table content -->
                </table><!-- /.data table -->
              </div><!-- /.box-body -->
            </div><!-- /.box -->
          </div><!-- /.col -->
        </div><!-- /.row -->
        <div data-ng-show="$ctrl.error" class="text-danger">
          <strong data-ng-bind="$ctrl.error"></strong>
        </div>
      </section><!-- /.content -->
    `
  })
  .name;
