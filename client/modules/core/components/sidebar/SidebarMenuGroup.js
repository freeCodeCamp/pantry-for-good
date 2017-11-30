import React from 'react'
import PropTypes from 'prop-types'
import {Route} from 'react-router-dom'

const SidebarMenuGroup = ({children, path, title}) =>
  <Route path={path}>
    {({match}) => (
      <li className={`treeview ${match && 'active'}`}>
        <a className="main-menuitem">
          {title}
          <span/>
        </a>
        <ul className="treeview-menu">
          {children}
        </ul>
      </li>
    )}
  </Route>

SidebarMenuGroup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default SidebarMenuGroup
