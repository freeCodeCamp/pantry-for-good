import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import NavbarUserMenu from './NavbarUserMenu'

const AdminNavbar = ({user, settings}) =>
  <header className="main-header">
    <Link to="/" className="logo">{settings && settings.organization}</Link>
    <nav className="navbar navbar-static-top" role="navigation">
      <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
        <span className="sr-only">Toggle navigation</span>
      </a>
      <NavbarUserMenu user={user} />
    </nav>
  </header>

AdminNavbar.propTypes = {
  user: PropTypes.object,
  settings: PropTypes.shape({
    organization: PropTypes.string
  })
}

export default AdminNavbar
