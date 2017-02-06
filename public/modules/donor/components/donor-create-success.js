import angular from 'angular';

export default angular.module('donor')
  .component('donorCreateSuccess', {
    bindings: {
      tconfig: '='
    },
    template: `
      <section class="row text-center">
        <foodbank-logo />
        <h3 class="col-md-12">Successfully submited. Thank you!</h3>
        <a href="/#!/" class="col-md-12">Go to {{tconfig.organization}}'s Homepage</a>
      </section>
    `
  })
  .name;