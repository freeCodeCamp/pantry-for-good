import React from 'react'
import {ConnectedRouter} from 'react-router-redux'
import {Route} from 'react-router-dom'

import Sidebar from './modules/core/components/sidebar/Sidebar'
import Header from './modules/core/components/Header'
import Footer from './modules/core/components/Footer'
import Home from './modules/core/components/Home'

import Customers from './modules/customer/components/Customers'

const Router = ({history}) =>
  <ConnectedRouter history={history}>
    <div className="wrapper">
      <Sidebar />
      <Header />
      <div className="content-wrapper">
        <Route exact path="/" component={Home} />
        <Route path="/customers" component={Customers} />
      </div>
      <Footer />
    </div>
  </ConnectedRouter>

export default Router
