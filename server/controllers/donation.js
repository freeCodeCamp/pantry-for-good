'use strict'
import Donation from '../models/donation'
import Donor from '../models/donor'
import Settings from '../models/settings'
/**
 * Module dependencies
 */
var //mongoose       = require('mongoose'),
  errorHandler   = require('./errors'),
    // Donation       = mongoose.model('Donation'),
    // Donor          = mongoose.model('Donor'),
    // Settings      = mongoose.model('Settings'),
  mailHelper    = require('sendgrid').mail,
  config         = require('../config/index')

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
      if (err) // eslint-disable-next-line no-console
        console.log(err)

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
            // eslint-disable-next-line no-console
            console.log(error, response.body.errors)
          }
        })
      })
    })
  })

  /*async.waterfall([
    function(done) {
      res.render('templates/donation-attachment-email', donation, function(err, emailHTMLAttachment) {
        phantom.create(function(err, ph) {
          ph.createPage(function(err, page) {
            page.set('content', emailHTMLAttachment);
            page.set('viewportSize', { width: 650, height: 720 });
            page.render('tax-receipt.png', { format: 'png', quality: '100' }, function() {
              console.log('E-mail attachment page rendered');
              ph.exit();
              done(err);
            });
          });
        });
      });
    },
    function(done) {
      var mailOptions = {
        to: donation.donorEmail,
        headers: {
          'X-MC-Template': 'donation',
          'X-MC-MergeVars': JSON.stringify({
            fullName: donation.donorName,
            date: donation.dateIssued,
            amount: donation.eligibleForTax
          })
        },
        attachments: [{
          filename: donation._id + '-tax-receipt.png',
          path: './tax-receipt.png'
        }]
      };

      smtpTransport.sendMail(mailOptions, function(err) {
        fs.unlinkSync('./tax-receipt.png');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
  });*/

  res.end()
}
