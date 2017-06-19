import React from 'react'
import {Route} from 'react-router-dom'

import EditPages from './components/EditPages'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'

const PageRouter = ({match}) =>
  <SwitchWithNotFound>
    <Route path={match.url} component={EditPages} />
  </SwitchWithNotFound>

export default PageRouter
