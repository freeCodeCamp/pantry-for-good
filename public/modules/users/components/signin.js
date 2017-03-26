import angular from 'angular';

export default angular.module('users')
  .component('signin', {
    bindings: {
      media: '='
    },
    controller: 'AuthenticationController',
    template: `
      <!-- Main content -->
      <section class="content">
        <!-- Login box -->
        <div class="login-box">
          <!-- Logo -->
          <div class="login-logo">
            <foodbank-logo store="$ctrl.store" />
          </div>
          <!-- Login box body -->
          <div class="login-box-body">
            <p class="login-box-msg">Sign in to start your session</p>
            <!-- Login form -->
            <form name="loginForm" data-ng-submit="$ctrl.signin()" autocomplete="off">
              <div class="form-group has-feedback">
                <input type="text"
                      class="form-control"
                      data-ng-model="$ctrl.credentials.username"
                      placeholder="Username"
                      required>
                <span class="glyphicon glyphicon-user form-control-feedback"></span>
              </div>
              <div class="form-group has-feedback">
                <input type="password"
                      class="form-control"
                      data-ng-model="$ctrl.credentials.password"
                      placeholder="Password"
                      required>
                <span class="glyphicon glyphicon-lock form-control-feedback"></span>
              </div>
              <div class="pull-right form-group">
                <button type="submit" class="btn btn-primary btn-flat">Sign in</button>&nbsp; or&nbsp;
                <a href="/#!/signup">Sign up</a>
              </div>
              <div class="form-group">
                <a href="/#!/password/forgot">Forgot your password?</a>
              </div>
              <br>
              <div data-ng-show="$ctrl.error" class="text-center text-danger">
                <strong data-ng-bind="$ctrl.error"></strong>
              </div>
            </form><!-- /.login-form -->
          </div><!-- /.login-box-body -->
        </div><!-- /.login-box -->
      </section><!-- /.main-content -->
    `
  })
  .name;
