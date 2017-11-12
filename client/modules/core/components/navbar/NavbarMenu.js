import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

const mapStateToProps = state => ({
  route: state.router.location
})

const NavbarMenu = ({route}) =>
  <div className="navbar-custom-menu">
    <ul className="nav navbar-nav">
      <li className={route.pathname === '/users/signup' && 'active'}>
        <Link to="/users/signup">Sign Up</Link>
      </li>
      <li className="divider-vertical"></li>
      <li className={route.pathname === '/users/signin' && 'active'}>
        <Link to="/users/signin">Sign In</Link>
      </li>
    </ul>
  </div>

NavbarMenu.propTypes = {
  route: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired
}

export default connect(mapStateToProps)(NavbarMenu)
