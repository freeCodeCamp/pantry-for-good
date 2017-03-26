import React from 'react'
import {sortBy} from 'lodash'
import {react2angular} from 'react2angular'
import angular from 'angular';

import SidebarMenuItem from './SidebarMenuItem'

const SidebarMenu = ({menu, user, route, push}) =>
  <div>
    <ul className="sidebar-menu">
      {menu.items && menu.items.map(item =>
        <li
          className={`treeview ${item.uiRoute === route && 'active'}`}
          key={item.uiRoute}
        >
          <SidebarMenuItem
            item={item}
            user={user}
            route={route}
            push={push}
          />
        </li>
      )}
    </ul>
  </div>

export default SidebarMenu

export const old = angular.module('core')
  .component('sidebarMenu', react2angular(SidebarMenu, ['menu', 'user', 'route', 'push']))
