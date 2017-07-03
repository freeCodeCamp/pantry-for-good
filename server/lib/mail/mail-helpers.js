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
    if (typeof sendEmail !== 'function') return

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
    const {fullName, email} = customer
    const date = customer.dateReceived.toDateString()

    if (customer.status === 'Accepted') {
      await this.send(
        email,
        fullName,
        'accept-customer',
        {fullName, date}
      )
    } else {
      await this.send(
        email,
        fullName,
        'reject-customer',
        {fullName, date}
      )
    }
  },

  /**
   * Send an email for account update
   *
   * @param {object} customer
   */
  async sendUpdate(customer) {
    const {fullName, email, id} = customer
    await this.send(
      email,
      fullName,
      'customer-update',
      {fullName, id}
    )
  },

  async sendPasswordReset(user, passwordResetLink) {
    const {firstName, lastName, email} = user
    const fullName = `${firstName} ${lastName}`
    await this.send(
      email,
      fullName,
      'password-reset',
      {fullName, passwordResetLink}
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
