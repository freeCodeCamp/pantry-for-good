import React from 'react'
import {ConnectedRouter} from 'react-router-redux'
import {Route} from 'react-router-dom'

import Sidebar from './modules/core/components/sidebar/Sidebar'
import Header from './modules/core/components/Header'
import Footer from './modules/core/components/Footer'
import Home from './modules/core/components/Home'

import Customers from './modules/customer/CustomerRoutes'
import Donors from './modules/donor/DonorRoutes'

const Router = ({history}) =>
  <ConnectedRouter history={history}>
    <div className="wrapper">
      <Sidebar />
      <Header />
      <div className="content-wrapper">
        <Route exact path="/" component={Home} />
        <Route path="/customers" component={Customers} />
        <Route path="/donors" component={Donors} />
      </div>
      <Footer />
    </div>
  </ConnectedRouter>

export default Router
