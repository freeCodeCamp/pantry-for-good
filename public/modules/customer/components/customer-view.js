export default angular.module('customer')
  .component('customerView', {
    controller: 'CustomerController',
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header" data-ng-init="$ctrl.findOne()">
        <h1><span data-ng-bind="$ctrl.dynType.fullName"></span></h1>
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
              <a class="btn btn-success" data-ng-click="$ctrl.update('Accepted')">Accept</a>
              <a class="btn btn-danger" data-ng-click="$ctrl.update('Rejected')">Reject</a>
              <a class="btn btn-warning" data-ng-click="$ctrl.update('Inactive')">Inactive</a>
              <a class="btn btn-warning" data-ng-click="$ctrl.delete($ctrl.dynType)">Delete</a>
              <a class="btn btn-primary" data-ng-href="/#!/admin/customers/{{$ctrl.dynType._id}}/edit">Edit</a>
              <a class="btn btn-primary" data-ng-href="/#!/admin/customers">Cancel</a>
            </div>
            <div class="form-group" data-ng-if="!$ctrl.isAdmin">
              <a class="btn btn-primary" data-ng-href="/#!/customer/{{$ctrl.dynType._id}}/edit">Edit</a>
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
