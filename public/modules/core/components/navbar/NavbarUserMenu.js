import React from 'react'
import {Link} from 'react-router-dom'

const NavbarUserMenu = ({user}) =>
  <div className="navbar-custom-menu">
    <ul className="nav navbar-nav">
      {/*<!-- User account -->*/}
      <li className="dropdown user user-menu">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
          <span>{user.displayName}</span>
        </a>
        <ul className="dropdown-menu">
          <li>
            <Link to="/settings/profile">Edit Profile</Link>
          </li>
          {user.provider === 'local' &&
            <li>
              <Link to="/settings/password">Change Password</Link>
            </li>
          }
          <li className="divider"></li>
          <li>
            <Link to="/api/auth/signout">Signout</Link>
          </li>
        </ul>
      </li>
    </ul>
  </div>

export default NavbarUserMenu
