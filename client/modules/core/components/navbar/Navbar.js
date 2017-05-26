import React from 'react'

import NavbarMenu from './NavbarMenu'
import NavbarUserMenu from './NavbarUserMenu'

const Navbar = ({user}) =>
  <nav className="navbar navbar-static-top" role="navigation">
    <a href="" className="sidebar-toggle" data-toggle="offcanvas" role="button">
      <span className="sr-only">Toggle navigation</span>
    </a>
    {user ?
      <NavbarUserMenu user={user} /> :
      <NavbarMenu />
    }
  </nav>

export default Navbar
