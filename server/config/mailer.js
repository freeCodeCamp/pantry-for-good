/**
 * This module adds functionality for the app to use email
 */

// import sendpulse from 'sendpulse-api'
import striptags from 'striptags'
// import config from './index.js'

// let sendEmail = null

// if (config.sendpulse.API_USER_ID && config.sendpulse.API_SECRET) {
//   const sp_config = config.sendpulse

//   sendpulse.init(sp_config.API_USER_ID, sp_config.API_SECRET, sp_config.TOKEN_STORAGE)

//   sendEmail = (recepientEmail, recepientName, subject, bodyHTML) => {
//     var message = {
//       "html" : bodyHTML,
//       "text" : striptags(bodyHTML, [], '\n'),
//       "subject" : subject,
//       "from" : {
//         "name" : sp_config.name,
//         "email" : sp_config.email
//       },
//       "to" : [ {
//         "name" : recepientName,
//         "email" : recepientEmail
//       } ]
//     }

//     return new Promise((resolve, reject) => {
//       sendpulse.smtpSendMail(sendpulseResponse => {
//         if (sendpulseResponse.result) resolve()
//         else reject (sendpulseResponse)
//       }, message)
//     })
//   }
// }

// export {sendEmail}

import nodemailer from 'nodemailer'
import Settings from '../models/settings'

export default async function sendEmail(toEmail, toName, subject, body) {
  console.log('Settings', Settings)

  const settings = await Settings.findOne().select('+keys').lean()
  const {mailService, mailUsername, mailPassword} = settings.keys
  if (!mailService || !mailUsername || !mailPassword) return

  const transporter = nodemailer.createTransport({
    service: mailService,
    auth: {
      user: mailUsername,
      pass: mailPassword
    }
  })

  return transporter.sendMail({
    from: mailUsername,
    to: toEmail,
    subject,
    text: striptags(body, [], '\n'),
    html: body
  }, err => console.error(err))
}
