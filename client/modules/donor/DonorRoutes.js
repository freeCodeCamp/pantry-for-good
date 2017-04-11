import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {connect} from 'react-redux'

import DonorList from './components/DonorList'
import DonorView from './components/DonorView'
import DonorEdit from './components/DonorEdit'
import DonorCreate from './components/DonorCreate'
import ClientCreateSuccess from '../../components/ClientCreateSuccess'

import './donor.css'

const mapStateToProps = state => ({
  user: state.auth.user
})

const DonorRoutes = ({match, user}) =>
  <Switch>
    {user && user.roles.find(role => role === 'admin') &&
      <Route path={`${match.url}`} exact component={DonorList} />
    }
    <Route path={`${match.url}/create/success`} component={ClientCreateSuccess} />
    <Route path={`${match.url}/create`} component={DonorCreate} />
    <Route path={`${match.url}/:donorId/edit`} component={DonorEdit} />
    <Route path={`${match.url}/:donorId`} component={DonorView} />
  </Switch>

export default connect(mapStateToProps)(DonorRoutes)
