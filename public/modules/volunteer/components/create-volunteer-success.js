import angular from 'angular';

export default angular.module('volunteer')
  .component('createVolunteerSuccess', {
    template: `
      <section class="row text-center">
        <foodbank-logo />
        <h3 class="col-md-12">Successfully submited. Thank you!</h3>
        <a href="/#!/" class="col-md-12">Go to {{$ctrl.settings.organization}}'s Homepage</a>
      </section>
    `
  })
  .name;
