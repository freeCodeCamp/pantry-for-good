import React from 'react'
import {connect} from 'react-redux'
import {trim} from 'lodash'

import {ADMIN_ROLE} from '../../../../common/constants'
import selectors from '../../../store/selectors'
import ClientNavbar from './navbar/ClientNavbar'
import AdminNavbar from './navbar/AdminNavbar'

const mapStateToProps = state => ({
  user: selectors.auth.getUser(state),
  route: state.router.location,
  settings: selectors.settings.getSettings(state)
})

const Header = ({settings, user, route}) => {
  const path = trim(route.pathname, '/')
  const isAdmin = user && user.roles.find(r => r === ADMIN_ROLE)

  return isAdmin ?
    <AdminNavbar user={user} settings={settings} /> :
    <ClientNavbar
      user={user}
      settings={settings}
      path={path}
    />
}

export default connect(mapStateToProps)(Header)
