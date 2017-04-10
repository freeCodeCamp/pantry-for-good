'use strict'

/**
 * Module dependencies
 */
var express = require('express'),
  donation = require('../controllers/donation')

var donationRouter = express.Router({mergeParams: true})

// Donation routes for admin
donationRouter.route('/admin/donations')
  .post(donation.create)

donationRouter.route('/admin/donations/:donorId')
  .put(donation.sendEmail)

module.exports = donationRouter
