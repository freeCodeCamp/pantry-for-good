import React from 'react'
import {Route} from 'react-router-dom'

import Questionnaire from './Questionnaire'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'

const QuestionnaireRouter = ({match}) =>
  <SwitchWithNotFound>
    <Route path={match.url} exact component={Questionnaire} />
  </SwitchWithNotFound>

export default QuestionnaireRouter
