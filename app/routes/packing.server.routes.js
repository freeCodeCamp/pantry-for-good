import express from 'express';
import packingController from '../controllers/packing.server.controller';

const packingRouter = express.Router({mergeParams: true});

packingRouter.route('/admin/packing')
  .put(packingController.pack);

export default packingRouter;
