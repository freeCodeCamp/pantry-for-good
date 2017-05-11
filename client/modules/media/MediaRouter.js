import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {connect} from 'react-redux'

import selectors from '../../store/selectors'
import Media from './components/Media'

const mapStateToProps = state => ({
  user: selectors.user.getUser(state)
})

const MediaRoutes = ({match, user}) =>
  <Switch>
    {isAdmin(user) &&
      <Route path={`${match.url}`} component={Media} />
    }
  </Switch>

export default connect(mapStateToProps)(MediaRoutes)

function isAdmin(user) {
  return user && user.roles.find(role => role === 'admin')
}
