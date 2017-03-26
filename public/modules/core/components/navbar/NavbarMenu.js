import React from 'react'
import {connect} from 'react-redux'

const mapStateToProps = state => ({
  stateName: state.router.currentState.name
})

const NavbarMenu = ({stateName}) =>
  <div className="navbar-custom-menu">
    <ul className="nav navbar-nav">
      <li className={stateName === 'root.signup' && 'active'}>
        <a href="/#!/signup">Sign Up</a>
      </li>
      <li className="divider-vertical"></li>
      <li className={stateName === 'root.signin' && 'active'}>
        <a href="/#!/signin">Sign In</a>
      </li>
    </ul>
  </div>

export default connect(mapStateToProps)(NavbarMenu)
