import React from 'react'
import {connect} from 'react-redux'

import selectors from '../../../store/selectors'
import userClientRole from '../../../lib/user-client-role'
import ClientNavbar from './navbar/ClientNavbar'
import AdminNavbar from './navbar/AdminNavbar'

const mapStateToProps = state => ({
  user: selectors.user.getUser(state),
  route: state.router.location,
  settings: selectors.settings.getSettings(state)
})

const Header = ({settings, user, route}) => {
  const clientRole = userClientRole(user)
  const homeUrl = clientRole ? `/${clientRole}s` : '/'
  const path = route.pathname.split('/').filter(s => s.length)

  return !user || clientRole ?
    <ClientNavbar
      user={user}
      settings={settings}
      path={path}
      homeUrl={homeUrl}
    /> :
    <AdminNavbar user={user} settings={settings} homeUrl={homeUrl} />
}

export default connect(mapStateToProps)(Header)
