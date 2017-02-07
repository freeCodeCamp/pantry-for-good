import angular from 'angular';

export default angular.module('volunteer')
  .component('viewVolunteer', {
    controller: 'VolunteerAdminController',
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header" data-ng-init="$ctrl.findOne()">
        <h1><span data-ng-bind="$ctrl.dynType.fullName"></span></h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <dynamic-view

            />
            <div class="form-group" data-ng-show="$ctrl.authentication.user.roles.indexOf('admin') >= 0">
              <a class="btn btn-warning" data-ng-click="$ctrl.update('Driver')">Driver</a>
              <a class="btn btn-success" data-ng-click="$ctrl.update('Active')">Active</a>
              <a class="btn btn-danger" data-ng-click="$ctrl.update('Inactive')">Inactive</a>
              <a class="btn btn-danger" data-ng-click="$ctrl.delete($ctrl.dynType)">Delete</a>
              <a class="btn btn-primary" data-ng-href="/#!/admin/volunteers/{{$ctrl.dynType._id}}/edit">Edit</a>
              <a class="btn btn-primary" data-ng-href="/#!/admin/volunteers">Cancel</a>
            </div>
            <div class="form-group" data-ng-show="$ctrl.authentication.user.roles.indexOf('admin') < 0">
              <a class="btn btn-primary" data-ng-href="/#!/volunteer/{{$ctrl.dynType._id}}/edit">Edit</a>
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
