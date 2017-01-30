import angular from 'angular';

export default angular.module('core')
  .component('navbarMenu', {
    template: `
      <ul class="nav navbar-nav">
        <li ui-route="/signup" ng-class="{active: $uiRoute}">
          <a href="/#!/signup">Sign Up</a>
        </li>
        <li class="divider-vertical"></li>
        <li ui-route="/signin" ng-class="{active: $uiRoute}">
          <a href="/#!/signin">Sign In</a>
        </li>
      </ul>
    `
  })
  .name;
