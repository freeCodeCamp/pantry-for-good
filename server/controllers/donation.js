import Donation from '../models/donation'
import Donor from '../models/donor'
import Settings from '../models/settings'
// import errorHandler from './errors'
import sendgrid, {mail as mailHelper} from 'sendgrid'
import config from '../config/index'

/**
 * Create a donation
 */
export const create = function(req, res) {
  var donation = new Donation(req.body)

  donation.save(function(err) {
    if (err) {
      return res.status(400).send({
        // message: errorHandler.getErrorMessage(err)
      })
    } else {
      res.json(donation)
    }
  })
}

/**
 * Send email receipt
 */
export const sendEmail = function(req, res, next) {
  const donation = req.body

  const temp = new Date(donation.dateIssued).toDateString().split(' ').splice(1)
  donation.dateIssued = temp[0] + ' ' + temp[1] + ', ' + temp[2]

  const donorId = req.params.donorId
  Donor.findById(donorId, function(err, donor) {
    if (err) return next(err)

    Settings.findOne({}, function(err, settings) {
      if (err)
        console.error(err)

      donation.tconfig = settings

      res.render('templates/donation-attachment-email', donation, (err, email) => {
        const from_email = new mailHelper.Email(config.mailer.from)
        const to_email = new mailHelper.Email(donor.email)
        const sg = sendgrid(config.mailer.sendgridKey)
        const sgContent = new mailHelper.Content('text/html', email)
        const mail = new mailHelper.Mail(from_email, "Tax Receipt", to_email, sgContent)
        const request = sg.emptyRequest({
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
