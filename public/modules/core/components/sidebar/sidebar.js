import angular from 'angular';

export default angular.module('core')
  .component('sidebar', {
    controller: 'SidebarController',
    template: `
      <section class="sidebar">
        <sidebar-menu
          user="$ctrl.auth.user"
          menu="$ctrl.menu"
        ></sidebar-menu>
      </section>
    `
  }).name;
