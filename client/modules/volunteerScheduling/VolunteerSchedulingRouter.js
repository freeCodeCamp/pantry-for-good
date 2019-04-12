import React from 'react'
import {Route} from 'react-router-dom'

import {ADMIN_ROLE} from '../../../common/constants'
import VolunteerScheduling from './components/VolunteerScheduling'
import requireRole from '../../components/router/requireRole'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'

const IsAdmin = requireRole([ADMIN_ROLE])

const VolunteerSchedulingRouter = ({match}) =>
  <SwitchWithNotFound>
    <Route path={`${match.url}/list`} exact component={IsAdmin(VolunteerScheduling)} />
  </SwitchWithNotFound>

export default VolunteerSchedulingRouter
