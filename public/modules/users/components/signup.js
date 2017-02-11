import angular from 'angular';

export default angular.module('users')
  .component('signup', {
    bindings: {
      media: '='
    },
    controller: 'AuthenticationController',
    template: `
      <!-- Main content -->
      <section class="content">
        <!-- Signup box -->
        <div class="register-box">
          <!-- Logo -->
          <div class="register-logo">
            <foodbank-logo />
          </div>
          <!-- Signup box body -->
          <div class="register-box-body">
            <h4 class="login-box-msg">Register a new membership</h4>
            <!-- Signup form -->
            <form name="userForm" data-ng-submit="$ctrl.signup()" autocomplete="off">
              <div class="form-group">
                <label>Please select an account to create</label>
                <div>
                  <label class="radio-inline">
                    <input name="account-type"
                          type="radio"
                          data-ng-model="$ctrl.credentials.accountType"
                          value="customer"
                          data-ng-required="!$ctrl.credentials.accountType">Client
                  </label>
                  <label class="radio-inline">
                    <input name="account-type"
                          type="radio"
                          data-ng-model="$ctrl.credentials.accountType"
                          value="volunteer"
                          data-ng-required="!$ctrl.credentials.accountType">Volunteer
                  </label>
                  <label class="radio-inline">
                    <input name="account-type"
                          type="radio"
                          data-ng-model="$ctrl.credentials.accountType"
                          value="donor"
                          data-ng-required="!$ctrl.credentials.accountType">Donor
                  </label>
                </div>
              </div>
              <div class="form-group">
                <input type="text"
                      class="form-control"
                      data-ng-model="$ctrl.credentials.firstName"
                      placeholder="First Name"
                      required>
              </div>
              <div class="form-group">
                <input type="text"
                      class="form-control"
                      data-ng-model="$ctrl.credentials.lastName"
                      placeholder="Last Name"
                      required>
              </div>
              <div class="form-group">
                <input type="email"
                      class="form-control"
                      data-ng-model="$ctrl.credentials.email"
                      placeholder="Email"
                      required>
              </div>
              <div class="form-group">
                <input type="text"
                      class="form-control"
                      data-ng-model="$ctrl.credentials.username"
                      placeholder="Username"
                      required>
              </div>
              <div class="form-group">
                <input type="password"
                      class="form-control"
                      data-ng-model="$ctrl.credentials.password"
                      placeholder="Password"
                      required>
              </div>
              <div class="text-center form-group">
                <button type="submit" class="btn btn-flat btn-primary">Sign up</button>&nbsp; or&nbsp;
                <a href="/#!/signin">Sign in</a>
              </div>
              <div data-ng-show="$ctrl.error" class="text-center text-danger">
                <strong data-ng-bind="$ctrl.error"></strong>
              </div>
            </form><!-- /.signup-form -->
          </div><!-- /.signup-box-body -->
        </div><!-- /.signup-box -->
      </section><!-- /.main-content -->
    `
  })
  .name;
