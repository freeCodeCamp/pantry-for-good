import React from 'react'
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
  </div>

export default NavbarUserMenu
