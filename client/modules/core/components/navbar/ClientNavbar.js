import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import ClientNavbarMenu from './ClientNavbarMenu'
import NavbarMenu from './NavbarMenu'
import NavbarUserMenu from './NavbarUserMenu'

const ClientNavbar = ({user, settings}) =>
  <header className="main-header">
    <nav className="navbar navbar-static-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            {settings && settings.organization}
          </Link>
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#navbar-collapse"
          >
            <i className="fa fa-bars"></i>
          </button>
        </div>

        <div className="collapse navbar-collapse" id="navbar-collapse">
          {user && <ClientNavbarMenu user={user} />}
          <ul className="nav navbar-nav navbar-right">
            {user ?
              <NavbarUserMenu user={user} /> :
              <NavbarMenu />
            }
          </ul>
        </div>
      </div>
    </nav>
  </header>

ClientNavbar.propTypes = {
  user: PropTypes.object,
  settings: PropTypes.shape({
    organization: PropTypes.string
  })
}

export default ClientNavbar
