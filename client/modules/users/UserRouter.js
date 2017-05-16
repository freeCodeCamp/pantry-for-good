import React from 'react'
import {Route} from 'react-router-dom'

import ChangePassword from './components/ChangePassword'
import EditProfile from './components/EditProfile'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import requireRole from '../../components/router/requireRole'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'

import './css/users.css'

const IsUser = requireRole(['admin', 'customer', 'donor', 'volunteer'])

const UserRouter = ({match}) =>
  <SwitchWithNotFound>
    <Route
      path={`${match.url}/change-password`}
      exact
      component={IsUser(ChangePassword)}
    />
    <Route
      path={`${match.url}/profile`}
      exact
      component={IsUser(EditProfile)}
    />
    <Route
      path={`${match.url}/forgot-password`}
      exact
      component={ForgotPassword}
    />
    <Route
      path={`${match.url}/reset-password/:token`}
      exact
      component={ResetPassword}
    />
    <Route path={`${match.url}/signin`} exact component={SignIn} />
    <Route path={`${match.url}/signup`} exact component={SignUp} />
  </SwitchWithNotFound>

export default UserRouter
