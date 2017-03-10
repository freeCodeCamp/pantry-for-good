import angular from 'angular';

export default angular.module('users')
  .component('forgotPassword', {
    controller: 'PasswordController',
    template: `
      <section class="row">
        <h3 class="col-md-12 text-center">Restore your password</h3>
        <p class="small text-center">Enter your account username.</p>
        <div class="col-xs-offset-2 col-xs-8 col-md-offset-5 col-md-2">
          <form data-ng-submit="$ctrl.forgotPassword($ctrl.credentials)" class="signin form-horizontal" autocomplete="off">
            <fieldset>
              <div class="form-group">
                <input type="text" id="username" name="username" class="form-control" data-ng-model="$ctrl.credentials.username" placeholder="Username">
              </div>
              <div class="text-center form-group">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>
              <div data-ng-show="$ctrl.error" class="text-center text-danger">
                <strong>{{$ctrl.error}}</strong>
              </div>
              <div data-ng-show="$ctrl.success" class="text-center text-success">
                <strong>Success {{$ctrl.success}}</strong>
              </div>
            </fieldset>
          </form>
        </div>
      </section>
    `
  })
  .name;
