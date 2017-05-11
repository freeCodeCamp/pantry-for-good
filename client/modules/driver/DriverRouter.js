import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {connect} from 'react-redux'

import DriverAdmin from './components/DriverList'
import DriverRoutes from './components/DriverAssignment'
// import DriverUser from './components/DriverUser'

import './driver.css'

const mapStateToProps = state => ({
  user: state.auth.user
})

const DonorRoutes = ({match, user}) =>
  <Switch>
    {isAdmin(user) &&
      <Route path={`${match.url}`} exact component={DriverAdmin} />
    }
    {isAdmin(user) ?
      <Route path={`${match.url}/routes`} component={DriverRoutes} /> :
      {/*<Route path={`${match.url}/routes`} component={DriverUser} />*/}
    }
  </Switch>

export default connect(mapStateToProps)(DonorRoutes)

function isAdmin(user) {
  return user && user.roles.find(role => role === 'admin')
}
