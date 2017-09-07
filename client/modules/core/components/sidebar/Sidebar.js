import React from 'react'
import {connect} from 'react-redux'

import {ADMIN_ROLE} from '../../../../../common/constants'
import selectors from '../../../../store/selectors'
import SidebarMenu from './SidebarMenu'

const mapStateToProps = state => ({
  user: selectors.auth.getUser(state),
  menu: state.app.menu,
  route: state.router.location
})

const Sidebar = ({
  user,
  menu,
  route,
}) => {
  const path = route.pathname.split('/').filter(s => s.length)
  const isAdmin = user && user.roles.find(r => r === ADMIN_ROLE)

  if (!isAdmin) return null
  return (
    <div className="main-sidebar">
      <section className="sidebar">
        <SidebarMenu menu={menu} path={path} />
      </section>
    </div>
  )
}

export default connect(mapStateToProps)(Sidebar)
