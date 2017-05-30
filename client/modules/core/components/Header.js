import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import selectors from '../../../store/selectors'
import userClientRole from '../../../lib/user-client-role'
import Navbar from './navbar/Navbar'

const mapStateToProps = state => ({
  user: selectors.user.getUser(state),
  settings: selectors.settings.getSettings(state)
})

const Header = ({settings, user}) => {
  const role = userClientRole(user)
  const homeUrl = role ? `/${role}s` : '/'

  return (
    <div className="main-header">
      <Link to={homeUrl} className="logo">{settings && settings.organization}</Link>
      <Navbar user={user} />
    </div>
  )
}

export default connect(mapStateToProps)(Header)
