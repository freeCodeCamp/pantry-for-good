import angular from 'angular';

export default angular.module('core')
  .component('navbar', {
    bindings: {
      user: '='
    },
    template: `
      <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button -->
        <a href="" class="sidebar-toggle" data-toggle="offcanvas" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>
        <!-- Navbar right menu -->
        <div class="navbar-custom-menu">
          <navbar-menu data-ng-hide="$ctrl.user"></navbar-menu>
          <navbar-user-menu data-ng-show="$ctrl.user" user="$ctrl.user"></navbar-user-menu>
        </div><!-- /.navbar-right-menu -->
      </nav><!-- /.header-navbar -->
    `
  })
  .name;
