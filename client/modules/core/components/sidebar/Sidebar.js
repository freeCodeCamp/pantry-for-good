import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import SidebarMenu from './SidebarMenu'

const mapStateToProps = state => ({
  auth: state.auth,
  menu: state.app.menu,
  route: state.router.location
})

const mapDispatchToProps = dispatch => ({
  push: route => dispatch(push(route))
})

const Sidebar = ({
  auth,
  menu,
  route,
  push
}) => (
  <div className="main-sidebar">
    <section className="sidebar">
      <SidebarMenu
        user={auth.user}
        menu={menu}
        route={route}
        push={push}
      />
    </section>
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
