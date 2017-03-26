import React from 'react'

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
            <a href="/#!/settings/profile">Edit Profile</a>
          </li>
          {user.provider === 'local' &&
            <li>
              <a href="/#!/settings/password">Change Password</a>
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
