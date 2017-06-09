'use strict'
import Donation from '../models/donation'
import Donor from '../models/donor'
import Settings from '../models/settings'
/**
 * Module dependencies
 */
var errorHandler = require('./errors'),
  mailHelper = require('sendgrid').mail,
  config = require('../config/index')

/**
 * Create a donation
 */
exports.create = function(req, res) {
  var donation = new Donation(req.body)

  donation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    } else {
      res.json(donation)
    }
  })
}

/**
 * Send email receipt
 */
exports.sendEmail = function(req, res, next) {
  var donation = req.body

  var temp = new Date(donation.dateIssued).toDateString().split(' ').splice(1)
  donation.dateIssued = temp[0] + ' ' + temp[1] + ', ' + temp[2]

  var donorId = req.params.donorId
  Donor.findById(donorId, function(err, donor) {
    if (err) return next(err)

    Settings.findOne({}, function(err, settings) {
      if (err)
        console.error(err)

      donation.tconfig = settings

      res.render('templates/donation-attachment-email', donation, function(err, email) {
        var from_email = new mailHelper.Email(config.mailer.from)
        var to_email = new mailHelper.Email(donor.email)
        var sg = require('sendgrid')(config.mailer.sendgridKey)
        var sgContent = new mailHelper.Content('text/html', email)
        var mail = new mailHelper.Mail(from_email, "Tax Receipt", to_email, sgContent)
        var request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        })

        sg.API(request, function(error, response) {
          if (error) {
            console.error(error, response.body.errors)
          }
        })
      })
    })
  })
  
  res.end()
}
