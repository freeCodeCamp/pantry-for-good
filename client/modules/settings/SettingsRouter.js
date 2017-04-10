import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {connect} from 'react-redux'

import Settings from './components/Settings'

const mapStateToProps = state => ({
  user: state.auth.user
})

const SettingsRoutes = ({match, user}) =>
  <Switch>
    {isAdmin(user) &&
      <Route path={`${match.url}`} component={Settings} />
    }
  </Switch>

export default connect(mapStateToProps)(SettingsRoutes)

function isAdmin(user) {
  return user && user.roles.find(role => role === 'admin')
}
