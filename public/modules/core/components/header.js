import angular from 'angular';

export default angular.module('core')
  .component('header', {
    controller: 'HeaderController',
    bindings: {
      tconfig: '='
    },
    template: `
      <!-- Logo -->
      <a data-ng-href="/#!/" class="logo">{{$ctrl.tconfig.organization}}</a>
      <!-- Header navbar -->
      <navbar user="$ctrl.authentication.user"></navbar>
    `
  })
  .name;
