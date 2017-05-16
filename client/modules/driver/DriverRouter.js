import React from 'react'
import {Route} from 'react-router-dom'

import DriverAdmin from './components/DriverList'
import DriverRoutes from './components/DriverAssignment'
// import DriverUser from './components/DriverUser'
import requireRole from '../../components/router/requireRole'
// import ownerOrAdmin from '../../components/router/ownerOrAdmin'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'

import './driver.css'

const IsAdmin = requireRole(['admin'])
// const Owns = ownerOrAdmin('driverId')

const DriverRouter = ({match}) =>
  <SwitchWithNotFound>
      <Route path={match.url} exact component={IsAdmin(DriverAdmin)} />
      <Route
        path={`${match.url}/routes`}
        exact
        component={IsAdmin(DriverRoutes)}
      />
      {/*<Route
        path={`${match.url}/:driverId/routes`}
        exact
        component={Owns(DriverUser)}
      />*/}
    }
  </SwitchWithNotFound>

export default DriverRouter
