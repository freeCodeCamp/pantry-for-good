import React from 'react'
import {Route} from 'react-router-dom'

import {ADMIN_ROLE, clientRoles} from '../../../common/constants'
import Home from '../core/components/Home'
import VolunteerList from './components/VolunteerList'
import VolunteerView from './components/VolunteerView'
import VolunteerEdit from './components/VolunteerEdit'
import VolunteerCreate from './components/VolunteerCreate'
import ClientCreateSuccess from '../../components/ClientCreateSuccess'
import requireRole from '../../components/router/requireRole'
import ownerOrAdmin from '../../components/router/ownerOrAdmin'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'

const IsAdmin = requireRole([ADMIN_ROLE])
const IsVolunteer = requireRole([ADMIN_ROLE, clientRoles.VOLUNTEER])
const Owns = ownerOrAdmin('volunteerId')

const VolunteerRouter = ({match}) =>
  <SwitchWithNotFound>
    <Route path={match.url} exact component={IsVolunteer(Home)} />
    <Route path={`${match.url}/list`} exact component={IsAdmin(VolunteerList)} />
    <Route
      path={`${match.url}/create/success`}
      exact
      component={IsVolunteer(ClientCreateSuccess)}
    />
    <Route
      path={`${match.url}/create`}
      exact
      component={VolunteerCreate}
    />
    <Route
      path={`${match.url}/:volunteerId/edit`}
      exact
      component={Owns(VolunteerEdit)}
    />
    <Route
      path={`${match.url}/:volunteerId`}
      exact
      component={Owns(VolunteerView)}
    />
  </SwitchWithNotFound>

export default VolunteerRouter
