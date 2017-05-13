import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {connect} from 'react-redux'

import ChangePassword from './components/ChangePassword'
import EditProfile from './components/EditProfile'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'

import './css/users.css'

const mapStateToProps = state => ({
  user: state.auth.user
})

const SettingsRoutes = ({match, user}) =>
  <div>
    {user ?
      <Switch>
        <Route path={`${match.url}/change-password`} component={ChangePassword} />
        <Route path={`${match.url}/profile`} component={EditProfile} />
      </Switch> :
      <Switch>
        <Route path={`${match.url}/forgot-password`} component={ForgotPassword} />
        <Route path={`${match.url}/reset-password/:token`} component={ResetPassword} />
        <Route path={`${match.url}/signin`} component={SignIn} />
        <Route path={`${match.url}/signup`} component={SignUp} />
      </Switch>
    }
  </div>

export default connect(mapStateToProps)(SettingsRoutes)
