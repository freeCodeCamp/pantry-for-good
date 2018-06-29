import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

const NavbarUserMenu = ({user}) =>
  <div className="navbar-custom-menu">
    <ul className="nav navbar-nav">
      {/*<!-- User account -->*/}
      <li className="dropdown user user-menu">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
          <span>{user.displayName || user.email}</span>
        </a>
        <ul className="dropdown-menu">
          <li>
            <Link to="/users/notifications">Notifications</Link>
          </li>
          <li>
            <Link to="/users/profile">Edit Profile</Link>
          </li>
          {user.provider === 'local' &&
          <li>
            <Link to="/users/change-password">Change Password</Link>
          </li>
          }
          <li className="divider"></li>
          <li>
            <a href="/api/auth/signout">Signout</a>
          </li>
        </ul>
      </li>
    </ul>

    <ul className="nav navbar-nav">
      {/*<!-- User account -->*/}
      <li className="dropdown user user-menu">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
          <span>{`(${user.notifications.length}) Notifications`}</span>
        </a>
        <ul className="dropdown-menu">
          {user.notifications.map((notification, index) => (
            <li key={index}>
              <Link to={notification.url}>#{index} {notification.message}</Link>
              <div className="divider"></div>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  </div>

NavbarUserMenu.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    provider: PropTypes.string,
    notifications: PropTypes.Array
  }).isRequired
}

export default NavbarUserMenu
