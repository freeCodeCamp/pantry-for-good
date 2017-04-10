import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {connect} from 'react-redux'

import Questionnaire from './components/Questionnaire'

const mapStateToProps = state => ({
  user: state.auth.user
})

const QuestionnaireRoutes = ({match, user}) =>
  <Switch>
    {isAdmin(user) &&
      <Route path={`${match.url}`} component={Questionnaire} />
    }
  </Switch>

export default connect(mapStateToProps)(QuestionnaireRoutes)

function isAdmin(user) {
  return user && user.roles.find(role => role === 'admin')
}
