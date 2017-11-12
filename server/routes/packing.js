import Router from 'express-promise-router'

import packingController from '../controllers/packing'
import websocketMiddleware from '../lib/websocket-middleware'
import {arrayOfPackages} from '../../common/schemas'

const packingRouter = Router({mergeParams: true})

const sync = {
  syncTo: ['volunteer'],
  type: 'packing/PACK_SUCCESS',
  schema: {
    packages: arrayOfPackages,
  }
}

packingRouter.route('/packing')
  .get(packingController.hasAuthorization, packingController.list)
  .post(packingController.hasAuthorization, websocketMiddleware(sync), packingController.pack)
  .delete(packingController.hasAuthorization, packingController.unpack)

export default packingRouter
