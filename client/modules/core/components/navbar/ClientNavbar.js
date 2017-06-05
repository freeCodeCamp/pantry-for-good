import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import NavbarMenu from './NavbarMenu'
import NavbarUserMenu from './NavbarUserMenu'

const mapStateToProps = state => ({
  items: state.app.menu.items,
  route: state.router.location
})

const ClientNavbar = ({items, user, settings, path, homeUrl}) =>
  <header className="main-header">
    <nav className="navbar navbar-static-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link to={homeUrl} className="navbar-brand">
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
          <ul className="nav navbar-nav">
            {items && items.map((item, i) => {
              const active = item.link.split('/').every((s, i) => path[i] === s)
              return (
                <li key={i} className={active ? 'active' : ''}>
                  <Link to={`/${item.link}`}>{item.title}</Link>
                </li>
              )
            })}
          </ul>
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

export default connect(mapStateToProps)(ClientNavbar)
