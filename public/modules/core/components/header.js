import angular from 'angular';

export default angular.module('core')
  .component('header', {
    controller: 'HeaderController',
    template: `
      <!-- Logo -->
      <a data-ng-href="/#!/" class="logo">{{$ctrl.settings.organization}}</a>
      <!-- Header navbar -->
      <navbar user="$ctrl.auth.user"></navbar>
    `
  })
  .name;
