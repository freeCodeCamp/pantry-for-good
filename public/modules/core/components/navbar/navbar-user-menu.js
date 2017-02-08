import angular from 'angular';

export default angular.module('core')
  .component('navbarUserMenu', {
    bindings: {
      user: '='
    },
    template: `
      <ul class="nav navbar-nav" data-ng-show="$ctrl.user">
        <!-- User account -->
        <li class="dropdown user user-menu">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" dropdown-toggle>
            <span data-ng-bind="$ctrl.user.displayName"></span>
          </a>
          <ul class="dropdown-menu">
            <li>
              <a href="/#!/settings/profile">Edit Profile</a>
            </li>
            <li data-ng-show="$ctrl.user.provider === 'local'">
              <a href="/#!/settings/password">Change Password</a>
            </li>
            <li class="divider"></li>
            <li>
              <a href="/api/auth/signout">Signout</a>
            </li>
          </ul>
        </li>
      </ul>
    `
  })
  .name;
