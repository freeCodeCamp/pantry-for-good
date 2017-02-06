import angular from 'angular';

export default angular.module('customer')
  .component('customerCreateSuccess', {
    bindings: {
      tconfig: '='
    },
    template: `
      <section class="row text-center">
        <foodbank-logo />
        <h3 class="col-md-12">Successfully submited. Thank you!</h3>
        <a href="/#!/" class="col-md-12">Go to {{$ctrl.tconfig.organization}}'s Homepage</a>
      </section>
    `
  })
  .name;
