import angular from 'angular';

export default angular.module('donor')
  .component('donorList', {
    controller: 'DonorAdminController',
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1>Donor Database</h1>
      </section>
      <!-- Main content -->
      <section class="content" data-ng-init="$ctrl.find()">
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
                      <td><span data-ng-bind="donor._id"></span></td>
                      <td><span data-ng-bind="donor.fullName"></span></td>
                      <td><span data-ng-bind="donor.totalDonated | currency:'$':2"></span></td>
                      <td><span data-ng-bind="donor.fullAddress"></span></td>
                      <td><span data-ng-bind="donor.telephoneNumber"></span></td>
                      <td><span data-ng-bind="donor.email"></span></td>
                      <td>
                        <a data-ng-href="/#!/admin/donors/{{donor._id}}" class="btn btn-info btn-flat btn-xs"><i class="fa fa-eye"></i> View</a>
                        <a data-ng-href="/#!/admin/donors/{{donor._id}}/edit" class="btn btn-primary btn-flat btn-xs"><i class="fa fa-pencil"></i> Edit</a>
                        <a data-ng-click="$ctrl.remove(donor)" class="btn btn-danger btn-flat btn-xs"><i class="fa fa-trash-o"></i> Delete</a>
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
