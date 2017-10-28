import React from 'react'
import PropTypes from 'prop-types'

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

SidebarMenu.propTypes = {
  menu: PropTypes.shape({
    items: PropTypes.array
  }).isRequired,
  path: PropTypes.array
}

export default SidebarMenu
