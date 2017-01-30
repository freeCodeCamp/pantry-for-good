import angular from 'angular';

export default angular.module('core')
  .component('sidebarMenuItem', {
    bindings: {
      item: '=',
      user: '='
    },
    template: `
      <a ng-switch-when="treeview" ui-sref="{{$ctrl.item.uiRoute}}" class="main-menuitem">
        <span data-ng-bind="$ctrl.item.title"></span>
        <i class="fa fa-angle-left pull-right"></i>
      </a>
      <ul ng-switch-when="treeview" class="treeview-menu">
        <li
          on-last-repeat
          data-ng-repeat="subitem in $ctrl.item.items | orderBy: 'position'"
          data-ng-if="subitem.shouldRender($ctrl.user);"
          ui-sref-active="active"
        >
          <a ui-sref="{{subitem.uiRoute}}" data-ng-bind="subitem.title" class="sub-menuitem"></a>
        </li>
      </ul>
      <a ng-switch-default ui-sref="{{$ctrl.item.uiRoute}}" class="main-menuitem">
        <span data-ng-bind="$ctrl.item.title"></span>
      </a>
    `
  }).name;
