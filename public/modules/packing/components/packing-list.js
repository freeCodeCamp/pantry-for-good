import angular from 'angular';

export default angular.module('packing')
  .component('packingList', {
    controller: 'PackingController',
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1>Packing List</h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <div class="box" st-table="$ctrl.customers">
              <!-- Box header -->
              <div class="box-header">
                <h3 class="box-title">Current week</h3>
                <div class="box-tools">
                  <div class="form-group has-feedback">
                    <input class="form-control" type="search" st-search placeholder="Search">
                    <span class="glyphicon glyphicon-search form-control-feedback"></span>
                  </div>
                </div>
              </div><!-- /.box-header -->
              <!-- Box body -->
              <div class="box-body table-responsive no-padding top-buffer">
                <!-- Table -->
                <table class="table table-striped table-bordered" print-section>
                  <!-- Table columns-->
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox" data-ng-model="$ctrl.allSelected" data-ng-click="$ctrl.selectAll()">
                        Packed ?
                      </th>
                      <th st-sort="_id">Client ID</th>
                      <th>Household</th>
                      <th data-ng-repeat="item in $ctrl.items">Item {{$index + 1}}</th>
                    </tr>
                  </thead><!-- /.table-columns -->
                  <!-- Table body -->
                  <tbody>
                    <tr data-ng-repeat="customer in $ctrl.customers">
                      <td><input type="checkbox" data-ng-model="customer.isChecked"></td>
                      <td><span data-ng-bind="customer.id"></span></td>
                      <td><span data-ng-bind="customer.householdSummary"></span></td>
                      <td data-ng-repeat="item in customer.packingList"><span data-ng-bind="item.name"></span></td>
                      <td data-ng-if="$ctrl.items.length !== customer.packingList.length" colspan="{{$ctrl.getColSpan(customer)}}">
                        N/A
                      </td>
                    </tr>
                    <tr data-ng-if="!$ctrl.customers.length">
                      <td class="text-center" colspan="{{$ctrl.items.length + 3}}">All food packages have been packed!</td>
                    </tr>
                  </tbody><!-- /.table-body -->
                </table><!-- /.table -->
              </div><!-- /.box-body -->
              <!-- Box footer -->
              <div class="box-footer">
                <div class="row">
                  <div class="col-sm-6 col-md-4 col-lg-2">
                    <button class="btn btn-primary btn-flat btn-block" data-ng-click="$ctrl.pack()" data-ng-disabled="$ctrl.isDisabled()">
                      Send packages
                    </button>
                  </div>
                  <div class="col-sm-6 col-md-4 col-lg-2 col-md-offset-4 col-lg-offset-8">
                    <button class="btn btn-default btn-flat btn-block" print-btn print-landscape>
                      <i class="fa fa-print"></i> Print
                    </button>
                  </div>
                </div>
              </div><!-- /.box-footer -->
              <div class="overlay" ng-show="$ctrl.loading">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
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
