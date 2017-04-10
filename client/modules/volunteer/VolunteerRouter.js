import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {connect} from 'react-redux'

import VolunteerList from './components/VolunteerList'
import VolunteerView from './components/VolunteerView'
import VolunteerEdit from './components/VolunteerEdit'
import VolunteerCreate from './components/VolunteerCreate'
import VolunteerCreateSuccess from './components/VolunteerCreateSuccess'

const mapStateToProps = state => ({
  user: state.auth.user
})

const Volunteers = ({match, user}) =>
  <Switch>
    {user && user.roles.find(role => role === 'admin') &&
      <Route path={`${match.url}`} exact component={VolunteerList} />
    }
    <Route path={`${match.url}/create/success`} component={VolunteerCreateSuccess} />
    <Route path={`${match.url}/create`} component={VolunteerCreate} />
    <Route path={`${match.url}/:volunteerId/edit`} component={VolunteerEdit} />
    <Route path={`${match.url}/:volunteerId`} component={VolunteerView} />
  </Switch>

export default connect(mapStateToProps)(Volunteers)
