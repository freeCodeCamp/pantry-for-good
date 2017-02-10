import angular from 'angular';

export default angular.module('common')
  .component('page', {
    bindings: {
      title: '='
    },
    transclude: true,
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1>{{$ctrl.title}}</h1>
      </section>
      <section class="content">
        <ng-transclude></ng-transclude>
      </section>
    `
  })
  .name;
