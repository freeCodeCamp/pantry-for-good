import React from 'react'
import {Route} from 'react-router-dom'

import {ADMIN_ROLE} from '../../../common/constants'
import DriverAdmin from './components/DriverList'
import DriverAssignment from './components/DriverAssignment'
import DriverRoute from './components/DriverRoute'
import requireRole from '../../components/router/requireRole'
import ownerOrAdmin from '../../components/router/ownerOrAdmin'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'

import './driver.css'

const IsAdmin = requireRole([ADMIN_ROLE])
const Owns = ownerOrAdmin('driverId')

const DriverRouter = ({ match }) =>
  <SwitchWithNotFound>
    <Route path={`${match.url}/list`} exact component={IsAdmin(DriverAdmin)} />
    <Route
      path={`${match.url}/routes`}
      exact
      component={IsAdmin(DriverAssignment)}
    />
    <Route
      path={`${match.url}/:driverId`}
      exact
      component={Owns(DriverRoute)}
    />
  </SwitchWithNotFound>

export default DriverRouter
