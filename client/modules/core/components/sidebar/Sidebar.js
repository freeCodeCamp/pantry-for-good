import React from 'react'
import {connect} from 'react-redux'

import selectors from '../../../../store/selectors'
import userClientRole from '../../../../lib/user-client-role'
import SidebarMenu from './SidebarMenu'

const mapStateToProps = state => ({
  user: selectors.user.getUser(state),
  menu: state.app.menu,
  route: state.router.location
})

const Sidebar = ({
  user,
  menu,
  route,
}) => {
  const path = route.pathname.split('/').filter(s => s.length)
  const clientRole = userClientRole(user)

  if (!user || clientRole) return null
  return (
    <div className="main-sidebar">
      <section className="sidebar">
        <SidebarMenu menu={menu} path={path} />
      </section>
    </div>
  )
}

export default connect(mapStateToProps)(Sidebar)
