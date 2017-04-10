import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {connect} from 'react-redux'

import Inventory from './components/Inventory'
import Schedule from './components/Schedule'
import Packing from './components/Packing'

const mapStateToProps = state => ({
  user: state.auth.user
})

const FoodRoutes = ({match, user}) =>
  <Switch>
    {isAdmin(user) &&
      <Route path={`${match.url}/inventory`} component={Inventory} />
    }
    {isAdmin(user) &&
      <Route path={`${match.url}/packing`} component={Packing} />
    }
    {isAdmin(user) &&
      <Route path={`${match.url}/schedule`} component={Schedule} />
    }
  </Switch>

export default connect(mapStateToProps)(FoodRoutes)

function isAdmin(user) {
  return user && user.roles.find(role => role === 'admin')
}
