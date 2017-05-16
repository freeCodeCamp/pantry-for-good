import React from 'react'
import {Route} from 'react-router-dom'

import Settings from './components/Settings'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'

const SettingsRouter = ({match}) =>
  <SwitchWithNotFound>
    <Route path={match.url} exact component={Settings} />
  </SwitchWithNotFound>

export default SettingsRouter
