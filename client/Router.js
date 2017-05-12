import React from 'react'
import {ConnectedRouter} from 'react-router-redux'
import {Route} from 'react-router-dom'

import Sidebar from './modules/core/components/sidebar/Sidebar'
import Header from './modules/core/components/Header'
import Footer from './modules/core/components/Footer'
import Home from './modules/core/components/Home'

import Customers from './modules/customer/CustomerRoutes'
import Donors from './modules/donor/DonorRoutes'
import Drivers from './modules/driver/DriverRouter'
import Foods from './modules/food/FoodRoutes'
import Media from './modules/media/MediaRouter'
import Questionnaire from './modules/questionnaire/QuestionnaireRouter'
import Settings from './modules/settings/SettingsRouter'
import Users from './modules/users/UserRouter'
import Volunteers from './modules/volunteer/VolunteerRouter'

const Router = ({history}) =>
  <ConnectedRouter history={history}>
    <div>
      <Sidebar />
      <Header />
      <div className="content-wrapper">
        <Route exact path="/" component={Home} />
        <Route path="/customers" component={Customers} />
        <Route path="/donors" component={Donors} />
        <Route path="/drivers" component={Drivers} />
        <Route path="/foods" component={Foods} />
        <Route path="/media" component={Media} />
        <Route path="/questionnaires" component={Questionnaire} />
        <Route path="/settings" component={Settings} />
        <Route path="/users" component={Users} />
        <Route path="/volunteers" component={Volunteers} />
      </div>
      <Footer />
    </div>
  </ConnectedRouter>

export default Router
