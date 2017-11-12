import Router from 'express-promise-router'

import deliveryController from '../controllers/delivery'
import websocketMiddleware from '../lib/websocket-middleware'
import {arrayOfCustomers, arrayOfVolunteers} from '../../common/schemas'

const sync = {
  syncTo: ['volunteer'],
  type: 'delivery/assignment/ASSIGN_SUCCESS',
  schema: {
    customers: arrayOfCustomers,
    volunteers: arrayOfVolunteers
  }
}

export default () => {
  const deliveryRouter = Router({mergeParams: true})

  deliveryRouter.route('/delivery/directions')
    .get(/*deliveryController.hasAuthorization,*/ deliveryController.directions)

  deliveryRouter.route('/admin/delivery/assign')
    .post(websocketMiddleware(sync), deliveryController.assign)

  return deliveryRouter
}
