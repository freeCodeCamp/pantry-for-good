import angular from 'angular';

export default angular.module('users')
  .component('editProfile', {
    controller: 'SettingsController',
    template: `
      <section class="row">
        <h3 class="col-md-12 text-center">Edit your profile</h3>
        <div class="col-xs-offset-2 col-xs-8 col-md-offset-5 col-md-2">
          <form name="userForm" data-ng-submit="$ctrl.updateUserProfile(userForm.$valid)" class="signin form-horizontal" autocomplete="off">
            <fieldset>
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" class="form-control" data-ng-model="$ctrl.user.firstName" placeholder="First Name">
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" class="form-control" data-ng-model="$ctrl.user.lastName" placeholder="Last Name">
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" class="form-control" data-ng-model="$ctrl.user.email" placeholder="Email">
              </div>
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" class="form-control" data-ng-model="$ctrl.user.username" placeholder="Username">
              </div>
              <div class="text-center form-group">
                <button type="submit" class="btn btn-large btn-primary">Save Profile</button>
              </div>
              <div data-ng-show="$ctrl.success" class="text-center text-success">
                <strong>Profile Saved Successfully</strong>
              </div>
              <div data-ng-show="$ctrl.error" class="text-center text-danger">
                <strong data-ng-bind="$ctrl.error"></strong>
              </div>
            </fieldset>
          </form>
        </div>
      </section>
    `
  })
  .name;