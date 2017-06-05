import express from 'express'
import packingController from '../controllers/packing'

const packingRouter = express.Router({mergeParams: true})

packingRouter.route('/packing')
  .put(packingController.hasAuthorization, packingController.pack)

export default packingRouter
