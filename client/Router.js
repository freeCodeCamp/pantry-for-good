import React from 'react'
import {ConnectedRouter} from 'react-router-redux'
import {Route} from 'react-router-dom'

import {ADMIN_ROLE, volunteerRoles} from '../common/constants'

import Sidebar from './modules/core/components/sidebar/Sidebar'
import Header from './modules/core/components/Header'
import Footer from './modules/core/components/Footer'
import Home from './modules/core/components/Home'
import Dialog from './modules/core/components/Dialog'
import Title from './modules/core/components/Title'

import Customers from './modules/customer/CustomerRouter'
import Donors from './modules/donor/DonorRouter'
import Drivers from './modules/driver/DriverRouter'
import Inventory from './modules/food/components/Inventory'
import Schedule from './modules/food/components/Schedule'
import Packing from './modules/food/components/Packing'
import Settings from './modules/settings/SettingsRouter'
import Users from './modules/users/UserRouter'
import Volunteers from './modules/volunteer/VolunteerRouter'

import requireRole from './components/router/requireRole'
import SwitchWithNotFound from './components/router/SwitchWithNotFound'

const IsAdmin = requireRole([ADMIN_ROLE])
const canInventory = requireRole([ADMIN_ROLE, volunteerRoles.INVENTORY])
const canPack = requireRole([ADMIN_ROLE, volunteerRoles.PACKING])
const canSchedule = requireRole([ADMIN_ROLE, volunteerRoles.SCHEDULE])

const Router = ({history}) =>
  <ConnectedRouter history={history}>
    <div>
      <Title />
      <Sidebar />
      <Header />
      <Dialog />
      <div className="content-wrapper">
        <SwitchWithNotFound>
          <Route exact path="/" component={Home} />
          <Route path="/customers" component={Customers} />
          <Route path="/donors" component={Donors} />
          <Route path="/drivers" component={Drivers} />
          <Route path="/inventory" exact component={canInventory(Inventory)} />
          <Route path="/packing" exact component={canPack(Packing)} />
          <Route path="/schedule" exact component={canSchedule(Schedule)} />
          <Route path="/settings" component={IsAdmin(Settings)} />
          <Route path="/users" component={Users} />
          <Route path="/volunteers" component={Volunteers} />
        </SwitchWithNotFound>
      </div>
      <Footer />
    </div>
  </ConnectedRouter>

export default Router
