import angular from 'angular';

export default angular.module('core')
  .component('sidebarMenu', {
    bindings: {
      menu: '=',
      user: '='
    },
    template: `
      <ul class="sidebar-menu" data-ng-if="$ctrl.menu.shouldRender($ctrl.user);">
        <li
          class="treeview"
          data-ng-repeat="item in $ctrl.menu.items | orderBy: 'position'"
          ng-switch="item.menuItemType"
          data-ng-if="item.shouldRender($ctrl.user);"
          ui-sref-active="active"
        >
          <sidebar-menu-item
            item="item"
            user="$ctrl.user"
          ></sidebar-menu-item>
        </li>
      </ul>
    `
  }).name;
