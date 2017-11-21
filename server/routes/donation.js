import Router from 'express-promise-router'
import donationController from '../controllers/donation'
import usersController from '../controllers/users'

const {requiresLogin} = usersController 

const donationRouter = Router({mergeParams: true})

donationRouter.route('/donations')
  .post(donationController.create)

donationRouter.route('/admin/donations/:donationId/approve')
  .put(donationController.approve)

donationRouter.route('/donations/:donationId')
  .put(requiresLogin, donationController.hasAuthorization, donationController.sendEmail)

export default donationRouter
