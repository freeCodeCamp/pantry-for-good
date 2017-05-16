import React from 'react'
import {Route} from 'react-router-dom'

import Inventory from './components/Inventory'
import Schedule from './components/Schedule'
import Packing from './components/Packing'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'

const FoodRouter = ({match}) =>
  <SwitchWithNotFound>
    <Route path={`${match.url}/inventory`} exact component={Inventory} />
    <Route path={`${match.url}/packing`} exact component={Packing} />
    <Route path={`${match.url}/schedule`} exact component={Schedule} />
  </SwitchWithNotFound>

export default FoodRouter
