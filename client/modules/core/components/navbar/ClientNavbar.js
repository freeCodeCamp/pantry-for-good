import React from 'react'
import {connect} from 'react-redux'
import {compose, withHandlers, withState} from 'recompose'
import {Link} from 'react-router-dom'
import {merge} from 'lodash'

import ClientNavbarItem from './ClientNavbarItem'
import NavbarMenu from './NavbarMenu'
import NavbarUserMenu from './NavbarUserMenu'

const mapStateToProps = state => ({
  items: state.app.menu.items,
  route: state.router.location
})

const enhance = compose(
  connect(mapStateToProps),
  withState('active', 'setActive', {}),
  withHandlers({
    setActive: ({setActive}) => index => subIndex => isActive =>
      setActive(active => {
        let activeCopy = merge({}, active)
        if (!activeCopy[index]) activeCopy[index] = []
        activeCopy[index][subIndex] = isActive

        return activeCopy
      })
  })
)

const ClientNavbar = ({items, user, settings, path, active, setActive}) =>
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
          <ul className="nav navbar-nav">
            {items && items.map((item, i) =>
              <ClientNavbarItem
                key={i}
                item={item}
                path={path}
                active={active[i] && active[i].some(x => x)}
                setActive={setActive(i)}
              />
            )}
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

export default enhance(ClientNavbar)
