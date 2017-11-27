import React from 'react'
import PropTypes from 'prop-types'
import {Link, Route} from 'react-router-dom'

const SidebarMenuItem = ({path, title}) =>
  <Route path={path} exact>
    {({match}) =>
      <li className={match && 'active'}>
        <Link to={path} className="submenu-item">
          <span>{title}</span>
        </Link>
      </li>
    }
  </Route>

SidebarMenuItem.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default SidebarMenuItem
