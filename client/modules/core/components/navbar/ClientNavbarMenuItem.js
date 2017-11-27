import React from 'react'
import PropTypes from 'prop-types'
import {Link, Route} from 'react-router-dom'

export const Divider = () => <li className="divider"></li>

const ClientNavbarMenuItem = ({path, title}) =>
  <Route path={path} exact>
    {({match}) =>
      <li className={match && 'active'}>
        <Link to={path}>{title}</Link>
      </li>
    }
  </Route>

ClientNavbarMenuItem.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default ClientNavbarMenuItem
