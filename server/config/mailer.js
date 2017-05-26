/**
 * This module adds functionality for the app to use email
 */

import sendpulse from 'sendpulse-api'
import striptags from 'striptags'
import config from './index.js'

let sendEmail = null

if (config.sendpulse) {
  const sp_config = config.sendpulse

  sendpulse.init(sp_config.API_USER_ID, sp_config.API_SECRET, sp_config.TOKEN_STORAGE)

  sendEmail = (recepientEmail, recepientName, subject, bodyHTML) => {
    var message = {
      "html" : bodyHTML,
      "text" : striptags(bodyHTML, [], '\n'),
      "subject" : subject,
      "from" : {
        "name" : sp_config.name,
        "email" : sp_config.email
      },
      "to" : [ {
        "name" : recepientName,
        "email" : recepientEmail
      } ]
    }

    return new Promise((resolve, reject) => {
      sendpulse.smtpSendMail(sendpulseResponse => {
        if (sendpulseResponse.result) resolve()
        else reject (sendpulseResponse)
      }, message)
    })
  }
}

export {sendEmail}

/**
 * Code for using sendgrid instead of sendpulse
 */
// mailHelper = require('sendgrid').mail,
// var from_email = new mailHelper.Email(config.mailer.from)
// var to_email = new mailHelper.Email(user.email)
// var sg = require('sendgrid')(config.mailer.sendgridKey)
// var sgContent = new mailHelper.Content('text/html', emailHTML)
// var mail = new mailHelper.Mail(from_email, "Password Reset", to_email, sgContent)
// var request = sg.emptyRequest({
//   method: 'POST',
//   path: '/v3/mail/send',
//   body: mail.toJSON()
// })
//
// sg.API(request, function(error, response) {
//   if (error) {
//     console.log(error)
//     console.log(response.body.errors)
//     res.status(500).send({
//       message: "Server Error"
//     })
//   } else {
//     res.send({
//       message: 'An email has been sent to ' + user.email + ' with further instructions.'
//     })
//   }
// })
//
// var smtpTransport = nodemailer.createTransport(config.mailer.options);
// var mailOptions = {
//   to: user.email,
//   from: config.mailer.from.first,
//   subject: 'Password Reset',
//   html: emailHTML
// };
// smtpTransport.sendMail(mailOptions, function(err) {
//   if (!err) {
//     res.send({
//       message: 'An email has been sent to ' + user.email + ' with further instructions.'
//     });
//   }
//
// });

