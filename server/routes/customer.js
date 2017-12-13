import Router from 'express-promise-router'

import customerController from '../controllers/customer'
import userController from '../controllers/users'
import websocketMiddleware from '../lib/websocket-middleware'
import {customer} from '../../common/schemas'

const sync = {schema: customer}
const saveSchema = {...sync, type: 'customer/SAVE_SUCCESS'}
const deleteSchema = {...sync, type: 'customer/DELETE_SUCCESS'}

export default () => {
  const {requiresLogin} = userController
  const {hasAuthorization, canChangeStatus} = customerController

  const customerRouter = Router({mergeParams: true})

  customerRouter.route('/customer')
    .post(requiresLogin, customerController.create)

  customerRouter.route('/customer/:customerId')
    .get(requiresLogin, hasAuthorization, customerController.read)
    .put(requiresLogin, hasAuthorization, canChangeStatus, customerController.update)

  customerRouter.get('/admin/customer', customerController.list)

  customerRouter.route('/admin/customers/:customerId')
    .put(websocketMiddleware(saveSchema), customerController.update)
    .delete(websocketMiddleware(deleteSchema), customerController.delete)

  // Finish by binding the customer middleware
  customerRouter.param('customerId', customerController.customerById)

  return customerRouter
}
