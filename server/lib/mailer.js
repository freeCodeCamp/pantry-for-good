import sendgrid, {mail as mailHelper} from 'sendgrid'
import {render as _render} from 'nunjucks'
import thenify from 'thenify'
import get from 'lodash/get'

import config from '../config/index'
import Settings from '../models/settings'

const render = thenify(_render)
const sg = sendgrid(config.mailer.sendgridKey)
const sgApi = thenify(sg.client.API)

export default {
  /**
   * Send an email
   *
   * @param {string} to
   * @param {string} subject
   * @param {string} template
   * @param {object} bindings
   * @returns {promise}
   */
  async send(to, subject, template, bindings = null) {
    const content = await renderTemplate(template, bindings)
    const from_email = new mailHelper.Email(config.mailer.from)
    const to_email = new mailHelper.Email(to)
    const sgContent = new mailHelper.Content('text/html', content)
    const mail = new mailHelper.Mail(from_email, subject, to_email, sgContent)

    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    })

    try {
      await sgApi(request)
    } catch (err) {
      handleSendgridError(err)
    }
  },

  /**
   * Send an email for account status update
   *
   * @param {object} customer
   * @returns {promise}
   */
  async sendStatus(customer) {
    const {fullName} = customer
    const date = customer.dateReceived.toDateString()

    if (customer.status === 'Accepted') {
      await this.send(
        customer.email,
        'Foodbank App acceptance letter',
        'accept-customer-email',
        {fullName, date}
      )
    } else {
      await this.send(
        customer.email,
        'Foodbank App rejection letter',
        'reject-customer-email',
        {fullName, date}
      )
    }
  },

  /**
   * Send an email for account update
   *
   * @param {object} customer
   * @returns {promise}
   */
  async sendUpdate(customer) {
    const {fullName, id} = customer
    await this.send(
      customer.email,
      'Food bank templete account update.',
      'update-customer-email',
      {fullName, id}
    )
  }
}

async function renderTemplate(template, bindings) {
  const tconfig = await Settings.findOne()
  const path = `templates/${template}.html`
  return await render(path, {tconfig, ...bindings})
}

function handleSendgridError(err) {
  // suppress errors during testing
  if (process.env.NODE_ENV === 'test') return

  if (err.body) {
    const errors = get(JSON.parse(err.body), 'errors', [])
    const message = errors.map(error => get(error, 'message'))
      .filter(errMsg => errMsg)
      .join(', ')
    // eslint-disable-next-line no-console
    console.error('sendgrid error %d:', err.statusCode, message)
  } else {
    // eslint-disable-next-line no-console
    console.error('sendgrid error', err.statusCode)
  }
}
