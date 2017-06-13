import Router from 'express-promise-router'

import donorController from '../controllers/donor'
import userController from '../controllers/users'

export default () => {
  const {requiresLogin} = userController
  const {hasAuthorization} = donorController

  const donorRouter = Router({mergeParams: true})

  // Donor routes for users
  donorRouter.route('/donor')
    .post(requiresLogin, donorController.create)
  donorRouter.route('/donor/:donorId')
    .get(requiresLogin, hasAuthorization, donorController.read)
    .put(requiresLogin, hasAuthorization, donorController.update)

  // Donor routes for admin
  donorRouter.route('/admin/donors')
    .get(donorController.list)
  donorRouter.route('/admin/donors/:donorId')
    .get(donorController.read)
    .put(donorController.update)
    .delete(donorController.delete)

  // Finish by binding the donor middleware
  donorRouter.param('donorId', donorController.donorById)

  return donorRouter
}
