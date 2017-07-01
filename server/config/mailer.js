/**
 * This module adds functionality for the app to use email
 */

import sendgrid, {mail as helper} from 'sendgrid'
import config from './index.js'

const sg = sendgrid(config.sendgrid.API_KEY)

export default async function sendEmail(toEmail, toName, {html, text, subject}) {
  if (!config.sendgrid.API_KEY || toEmail.endsWith('@example.com')) return

  const from = new helper.Email('admin@foodbank')
  const to = new helper.Email(toEmail, toName)
  const content = new helper.Content('text/plain', text)
  const mail = new helper.Mail(from, subject, to, content)
  mail.addContent(new helper.Content('text/html', html))

  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  })

  return sg.API(request)
}
