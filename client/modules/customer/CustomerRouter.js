import React from 'react'
import {Route} from 'react-router-dom'

import {ADMIN_ROLE, clientRoles} from '../../../common/constants'
import Home from '../core/components/Home'
import CustomerList from './components/CustomerList'
import CustomerView from './components/CustomerView'
import CustomerEdit from './components/CustomerEdit'
import CustomerCreate from './components/CustomerCreate'
import ClientCreateSuccess from '../../components/ClientCreateSuccess'
import requireRole from '../../components/router/requireRole'
import ownerOrAdmin from '../../components/router/ownerOrAdmin'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'

import './customer.css'

const IsAdmin = requireRole([ADMIN_ROLE])
const IsCustomer = requireRole([clientRoles.CUSTOMER, ADMIN_ROLE])
const Owns = ownerOrAdmin('customerId')

const CustomerRouter = ({match}) =>
  <SwitchWithNotFound>
    <Route path={match.url} exact component={IsCustomer(Home)} />
    <Route path={`${match.url}/list`} exact component={IsAdmin(CustomerList)} />
    <Route
      path={`${match.url}/create/success`}
      exact
      component={IsCustomer(ClientCreateSuccess)}
    />
    <Route
      path={`${match.url}/create`}
      exact
      component={CustomerCreate}
    />
    <Route
      path={`${match.url}/:customerId/edit`}
      exact
      component={Owns(CustomerEdit)}
    />
    <Route
      path={`${match.url}/:customerId`}
      exact
      component={Owns(CustomerView)}
    />
  </SwitchWithNotFound>

export default CustomerRouter
