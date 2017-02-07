import angular from 'angular';

export default angular.module('users')
  .component('resetPasswordFailure', {
    template: `
      <section class="row text-center">
        <h3 class="col-md-12">Password reset is invalid</h3>
        <a href="/#!/password/forgot" class="col-md-12">Ask for a new password reset</a>
      </section>
    `
  })
  .name;
