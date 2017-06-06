import Router from 'express-promise-router'

import packingController from '../controllers/packing'
import websocketMiddleware from '../lib/websocket-middleware'
import {arrayOfCustomers, arrayOfFoodItems} from '../../common/schemas'

const packingRouter = Router({mergeParams: true})

const sync = {
  syncTo: ['volunteer'],
  type: 'packing/PACK_SUCCESS',
  schema: {
    customers: arrayOfCustomers,
    foodItems: arrayOfFoodItems
  }
}

packingRouter.route('/packing')
  .put(packingController.hasAuthorization, websocketMiddleware(sync), packingController.pack)

export default packingRouter
