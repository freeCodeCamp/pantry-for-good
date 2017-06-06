import React from 'react'
import {ConnectedRouter} from 'react-router-redux'
import {Route} from 'react-router-dom'

import Sidebar from './modules/core/components/sidebar/Sidebar'
import Header from './modules/core/components/Header'
import Footer from './modules/core/components/Footer'
import Home from './modules/core/components/Home'
import Dialog from './modules/core/components/Dialog'

import Customers from './modules/customer/CustomerRouter'
import Donors from './modules/donor/DonorRouter'
import Drivers from './modules/driver/DriverRouter'
import Inventory from './modules/food/components/Inventory'
import Schedule from './modules/food/components/Schedule'
import Packing from './modules/food/components/Packing'
import Page from './modules/page/PageRouter'
import Questionnaire from './modules/questionnaire/QuestionnaireRouter'
import Settings from './modules/settings/SettingsRouter'
import Users from './modules/users/UserRouter'
import Volunteers from './modules/volunteer/VolunteerRouter'

import requireRole from './components/router/requireRole'
import SwitchWithNotFound from './components/router/SwitchWithNotFound'

const IsAdmin = requireRole(['admin'])
const IsVolunteer = requireRole(['admin', 'volunteer'])

const Router = ({history}) =>
  <ConnectedRouter history={history}>
    <div>
      <Sidebar />
      <Header />
      <Dialog />
      <div className="content-wrapper">
        <SwitchWithNotFound>
          <Route exact path="/" component={Home} />
          <Route path="/customers" component={Customers} />
          <Route path="/donors" component={Donors} />
          <Route path="/drivers" component={Drivers} />
          <Route path="/inventory" exact component={IsVolunteer(Inventory)} />
          <Route path="/packing" exact component={IsVolunteer(Packing)} />
          <Route path="/schedule" exact component={IsVolunteer(Schedule)} />
          <Route path="/pages" component={IsAdmin(Page)} />
          <Route path="/questionnaires" component={IsAdmin(Questionnaire)} />
          <Route path="/settings" component={IsAdmin(Settings)} />
          <Route path="/users" component={Users} />
          <Route path="/volunteers" component={Volunteers} />
        </SwitchWithNotFound>
      </div>
      <Footer />
    </div>
  </ConnectedRouter>

export default Router
