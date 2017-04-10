import React from 'react'

import SidebarMenuItem from './SidebarMenuItem'

const SidebarMenu = ({menu, user, route, push}) =>
  <div>
    <ul className="sidebar-menu">
      {menu.items && menu.items.map((item, i) =>
        <li
          className={`treeview ${item.link === route.pathname && 'active'}`}
          key={i}
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
