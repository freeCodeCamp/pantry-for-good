import Router from 'express-promise-router'

import deliveryController from '../controllers/delivery'

export default () => {
  const deliveryRouter = Router({mergeParams: true})

  deliveryRouter.route('/delivery/directions')
    .get(/*deliveryController.hasAuthorization,*/ deliveryController.directions)

  deliveryRouter.route('/admin/delivery/assign')
    .post(deliveryController.assign)

  return deliveryRouter
}
