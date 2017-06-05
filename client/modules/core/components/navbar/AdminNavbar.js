import React from 'react'
import {Link} from 'react-router-dom'

import NavbarUserMenu from './NavbarUserMenu'

const AdminNavbar = ({user, settings, homeUrl}) =>
  <header className="main-header">
    <Link to={homeUrl} className="logo">{settings && settings.organization}</Link>
    <nav className="navbar navbar-static-top" role="navigation">
      <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
        <span className="sr-only">Toggle navigation</span>
      </a>
      <NavbarUserMenu user={user} />
    </nav>
  </header>

export default AdminNavbar
