import React from 'react'

import SidebarMenuItem from './SidebarMenuItem'

const SidebarMenu = ({menu, user, path, push}) =>
  <div>
    <ul className="sidebar-menu">
      {menu.items && menu.items.map((item, i) =>
        <li
          className={`treeview ${item.link === path && 'active'}`}
          key={i}
        >
          <SidebarMenuItem
            item={item}
            user={user}
            path={path}
            push={push}
          />
        </li>
      )}
    </ul>
  </div>

export default SidebarMenu
