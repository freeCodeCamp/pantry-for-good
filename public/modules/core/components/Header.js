import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import Navbar from './navbar/Navbar'

const mapStateToProps = state => ({
	auth: state.auth,
  settings: state.settings.data,
  fetchingSettings: state.settings.fetching,
  media: state.media.data,
  fetchingMedia: state.media.fetching
});

const Header = ({settings, auth}) =>
  <div className="main-header">
    <Link to="/" className="logo">{settings && settings.organization}</Link>
    <Navbar user={auth.user} />
  </div>

export default connect(mapStateToProps)(Header)
