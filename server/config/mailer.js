/**
 * This module adds functionality for the app to use email
 */

import {readFileSync} from 'fs'
import mime from 'mime-types'
import sendgrid, {mail as helper} from 'sendgrid'

import config from './index.js'
import Media from '../models/media'

const sg = sendgrid(config.sendgrid.API_KEY)
const path = process.env.NODE_ENV === 'production' ?
  'dist/client/' :
  'assets/'

export default async function sendEmail(
  toEmail,
  toName,
  {html, text, subject, attachments}
) {
  if (!config.sendgrid.API_KEY || toEmail.endsWith('@example.com')) return

  const from = new helper.Email(config.mailFrom)
  const to = new helper.Email(toEmail, toName)
  const content = new helper.Content('text/plain', text)
  const mail = new helper.Mail(from, subject, to, content)
  mail.addContent(new helper.Content('text/html', html))

  if (attachments.length) {
    const media = await Media.findOne().lean()

    attachments.forEach(attachmentId => {
      const file = `${path}${media.path}${media[attachmentId]}`
      const content = readFileSync(file).toString('base64')

      const attachment = new helper.Attachment()
      attachment.setContent(content)
      attachment.setType(mime.lookup(file))
      attachment.setFilename(file)
      attachment.setDisposition('inline')
      attachment.setContentId(attachmentId)
      mail.addAttachment(attachment)
    })
  }

  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  })
  
  return sg.API(request)
}
