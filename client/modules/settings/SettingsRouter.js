import React from 'react'
import {Route} from 'react-router-dom'

import Settings from './components/Settings'
import Page from '../page/PageRouter'
import Questionnaire from '../questionnaire/QuestionnaireRouter'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'

const SettingsRouter = ({match}) =>
  <SwitchWithNotFound>
    <Route path={match.url} exact component={Settings} />
    <Route path={`${match.url}/pages`} exact component={Page} />
    <Route path={`${match.url}/emails`} exact component={Page} />
    <Route path={`${match.url}/questionnaires`} exact component={Questionnaire} />
  </SwitchWithNotFound>

export default SettingsRouter
