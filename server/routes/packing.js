import express from 'express';
import packingController from '../controllers/packing';

const packingRouter = express.Router({mergeParams: true});

packingRouter.route('/admin/packing')
  .put(packingController.pack);

export default packingRouter;
