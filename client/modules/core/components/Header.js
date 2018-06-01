import React from 'react'
import PropTypes from 'prop-types'

import {connect} from 'react-redux'

import {ADMIN_ROLE} from '../../../../common/constants'
import selectors from '../../../store/selectors'
import ClientNavbar from './navbar/ClientNavbar'
import AdminNavbar from './navbar/AdminNavbar'

const mapStateToProps = state => ({
  user: selectors.auth.getUser(state),
  settings: selectors.settings.getSettings(state)
})

const Header = ({settings, user}) => {
  const isAdmin = user && user.roles.find(r => r === ADMIN_ROLE)

  return isAdmin ?
    <AdminNavbar user={user} settings={settings} /> :
    <ClientNavbar user={user} settings={settings} />
}

Header.propTypes = {
  settings: PropTypes.object,
  user: PropTypes.object,
}

export default connect(mapStateToProps)(Header)
