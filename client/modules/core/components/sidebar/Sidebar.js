import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {ADMIN_ROLE} from '../../../../../common/constants'
import selectors from '../../../../store/selectors'
import SidebarMenu from './SidebarMenu'

const mapStateToProps = state => ({
  user: selectors.auth.getUser(state)
})

const Sidebar = ({user}) => {
  const isAdmin = user && user.roles.find(r => r === ADMIN_ROLE)

  if (!isAdmin) return null
  return (
    <div className="main-sidebar">
      <section className="sidebar">
        <SidebarMenu />
      </section>
    </div>
  )
}

Sidebar.propTypes = {
  user: PropTypes.shape({
    roles: PropTypes.array
  })
}

export default connect(mapStateToProps)(Sidebar)
