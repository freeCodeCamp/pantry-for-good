import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

const mapStateToProps = state => ({
  settings: state.settings.data,
})

var date = new Date();

const Footer = ({settings}) =>
  <footer className="main-footer">
    <strong>Copyright &copy; {{ year }}&nbsp;
      <Link to="/">{settings && settings.organization}</Link>.
    </strong>
    &ensp;All rights reserved.
  </footer>

export default connect(mapStateToProps)(Footer)
