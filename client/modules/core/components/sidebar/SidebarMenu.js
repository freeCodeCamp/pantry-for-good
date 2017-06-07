import React from 'react'

import SidebarMenuItem from './SidebarMenuItem'

const SidebarMenu = ({menu, path}) =>
  <ul className="sidebar-menu">
    {menu.items && menu.items.map((item, i) =>
      <SidebarMenuItem
        key={i}
        item={item}
        path={path}
        depth={0}
      />
    )}
  </ul>

export default SidebarMenu
