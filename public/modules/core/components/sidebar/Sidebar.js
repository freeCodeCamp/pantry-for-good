import React from 'react'
import {connect} from 'react-redux'
import {stateGo} from 'redux-ui-router'

import SidebarMenu from './SidebarMenu'

const mapStateToProps = state => ({
	auth: state.auth,
  menu: state.app.menu,
	route: state.router.currentState.name
});

const mapDispatchToProps = dispatch => ({
	push: route => dispatch(stateGo(route))
})

const Sidebar = ({
  auth,
  menu,
  route,
  push
}) => (
  <section className="sidebar">
    <SidebarMenu
      user={auth.user}
      menu={menu}
      route={route}
      push={push}
    />
  </section>
)

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
