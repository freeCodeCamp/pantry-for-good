import express from 'express'
import donationController from '../controllers/donation'

const donationRouter = express.Router({mergeParams: true})

// Donation routes for admin
donationRouter.route('/donations')
  .post(donationController.hasAuthorization, donationController.create)

donationRouter.route('/admin/donations/:donationId/approve')
  .put(donationController.approve)

// donationRouter.route('/admin/donations/:donorId')
//   .put(donation.sendEmail)

export default donationRouter
