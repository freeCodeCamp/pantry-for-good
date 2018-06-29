import React from 'react'

import MenuGroup from './SidebarMenuGroup'
import MenuItem from './SidebarMenuItem'

const SidebarMenu = () => 
  <ul className="sidebar-menu" data-widget="tree">
    <MenuItem title="Customers" path="/customers/list" />
    <MenuItem title="Volunteers" path="/volunteers/list" />
    <MenuItem title="Donors" path="/donors/list" />

    <MenuItem title="User Accounts" path="/users/list" />

    <MenuItem title="Food Schedule" path="/schedule" />
    <MenuItem title="Packing List" path="/packing" />
    <MenuItem title="Inventory" path="/inventory" />

    <MenuGroup title="Delivery" path="/drivers">
      <MenuItem title="Drivers" path="/drivers/list" />
      <MenuItem title="Route Assignment" path="/drivers/routes" />
    </MenuGroup>

    <MenuGroup title="Settings" path="/settings">
      <MenuItem title="General" path="/settings" />
      <MenuItem title="Pages" path="/settings/pages" />
      <MenuItem title="Emails" path="/settings/emails" />
      <MenuItem title="Applications" path="/settings/questionnaires" />
    </MenuGroup>
  </ul>

export default SidebarMenu
