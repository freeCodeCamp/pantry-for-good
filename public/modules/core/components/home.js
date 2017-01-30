import angular from 'angular';

export default angular.module('core')
  .component('home', {
    template: `
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <div class="row text-center">
          <foodbank-logo />
        </div>
      </section>
    `
  })
  .name;
