import express from 'express'
import * as donation from '../controllers/donation'

const donationRouter = express.Router({mergeParams: true})

// Donation routes for admin
donationRouter.route('/admin/donations')
  .post(donation.create)

donationRouter.route('/admin/donations/:donorId')
  .put(donation.sendEmail)

export default donationRouter
