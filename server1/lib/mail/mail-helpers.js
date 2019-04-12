import {pageIdentifiers} from '../../../common/constants'
import mailGenerator from './mail-generator'
import sendEmail from '../../config/mailer'
import Settings from '../../models/settings'

export default {
  /**
   * Send an email
   *
   * @param {string} toEmail
   * @param {string} toName
   * @param {string} identifier
   * @param {object} bindings
   */
  async send(toEmail, toName, identifier, bindings = null) {
    const settings = await Settings.findOne().lean()
    const mail = await mailGenerator(identifier, {...settings, ...bindings})
    if (!mail) return

    try {
      await sendEmail(toEmail, toName, mail)
    } catch (err) {
      handleError(err)
    }
  },

  /**
   * Send an email for account status update
   *
   * @param {object} customer
   */
  async sendStatus(customer) {
    const {firstName, lastName, fullName, email} = customer
    const date = customer.dateReceived.toDateString()

    if (customer.status === 'Accepted') {
      await this.send(
        email,
        fullName,
        pageIdentifiers.CUSTOMER_ACCEPTED,
        {fullName, date}
      )
    } else if (customer.status === 'Rejected'){
      await this.send(
        email,
        fullName,
        pageIdentifiers.CUSTOMER_REJECTED,
        {firstName, lastName, fullName, date}
      )
    }
  },

  /**
   * Send an email for account update
   *
   * @param {object} customer
   */
  async sendUpdate(customer) {
    const {firstName, lastName, fullName, email, id} = customer
    await this.send(
      email,
      fullName,
      pageIdentifiers.CUSTOMER_UPDATED,
      {firstName, lastName, fullName, id}
    )
  },

  async sendPasswordReset(user, passwordResetLink) {
    const {firstName, lastName, email} = user
    const fullName = `${firstName} ${lastName}`
    await this.send(
      email,
      fullName,
      pageIdentifiers.PASSWORD_RESET,
      {firstName, lastName, fullName, passwordResetLink}
    )
  },

  async sendPasswordGoogle(user) {
    const {firstName, lastName, email} = user
    const fullName = `${firstName} ${lastName}`
    await this.send(
      email,
      fullName,
      pageIdentifiers.PASSWORD_RESET_GOOGLE,
      {firstName, lastName, fullName}
    )
  },

  async sendThanks(donation) {
    const {donor} = donation
    const {firstName, lastName, email} = donor
    const fullName = `${firstName} ${lastName}`
    await this.send(
      email,
      fullName,
      pageIdentifiers.DONATION_RECEIVED,
      {firstName, lastName, fullName}
    )
  },

  async sendReceipt(donation) {
    const {donor, items} = donation
    const {firstName, lastName, email} = donor
    const fullName = `${firstName} ${lastName}`
    await this.send(
      email,
      fullName,
      pageIdentifiers.DONATION_RECEIPT,
      {firstName, lastName, fullName, items}
    )
  }
}

function handleError(err) {
  // suppress errors during testing
  if (process.env.NODE_ENV === 'test') return

  console.error('email error', err)
  console.error(err.response.body.errors)

  // throw err
}
