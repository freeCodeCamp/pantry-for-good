import React from 'react'
import {Route} from 'react-router-dom'

import {ADMIN_ROLE} from '../../../common/constants'
import UserList from './components/UserList'
import ChangePassword from './components/ChangePassword'
import ConfirmNewGoogleAccount from './components/ConfirmNewGoogleAccount'
import EditProfile from './components/EditProfile'
import EditUser from './components/EditUser'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import requireRole from '../../components/router/requireRole'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'
import userOrRedirect from '../../components/router/userOrRedirect'

import './css/users.css'

const IsAdmin = requireRole([ADMIN_ROLE])

const UserRouter = ({match}) =>
  <SwitchWithNotFound>
    <Route
      path={`${match.url}/list`}
      exact
      component={IsAdmin(UserList)}
    />
    <Route
      path={`${match.url}/:userId/edit`}
      exact
      component={IsAdmin(EditUser)}
    />
    <Route
      path={`${match.url}/change-password`}
      exact
      component={userOrRedirect(ChangePassword)}
    />
    <Route
      path={`${match.url}/profile`}
      exact
      component={userOrRedirect(EditProfile)}
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
    <Route
      path={`${match.url}/confirm-new-google-account`}
      exact
      component={ConfirmNewGoogleAccount}
    />
  </SwitchWithNotFound>

export default UserRouter
