import angular from 'angular';

export default angular.module('core')
  .component('sidebar', {
    controller: 'SidebarController',
    template: `
      <section class="sidebar">
        <sidebar-menu
          user="$ctrl.authentication.user"
          menu="$ctrl.menu"
        ></sidebar-menu>
      </section>
    `
  }).name;
