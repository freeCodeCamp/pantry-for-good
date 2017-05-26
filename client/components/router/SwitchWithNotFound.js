import React from 'react'
import {Switch, Route} from 'react-router-dom'

import NotFound from '../../modules/core/components/errors/NotFound'

const SwitchWithNotFound = ({children, ...props}) =>
  <Switch {...props}>
    {children}
    <Route component={NotFound} />
  </Switch>

export default SwitchWithNotFound
