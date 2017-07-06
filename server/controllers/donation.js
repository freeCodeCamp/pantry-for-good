import {ADMIN_ROLE} from '../../common/constants'
import Donation from '../models/donation'
import {UnauthorizedError} from '../lib/errors'
import mailer from '../lib/mail/mail-helpers'

export default {
  async create(req, res) {
    let donation = {
      ...req.body,
      total: req.body.items.reduce((acc, item) => acc + item.value, 0)
    }

    if (!req.user.roles.find(r => r === ADMIN_ROLE) &&
        donation.donor !== req.user.id) {
      throw new UnauthorizedError
    }

    const savedDonation = await Donation.create(donation)
    await savedDonation.populate('donor').execPopulate()

    mailer.sendThanks(savedDonation)

    res.json(savedDonation)
  },

  async approve(req, res) {
    const donation = await Donation.findByIdAndUpdate(
      req.params.donationId,
      {$set: {approved: true, dateIssued: Date.now()}},
      {new: true}
    ).populate('donor')

    mailer.sendReceipt(donation)

    res.json(donation)
  },

  async sendEmail(req, res) {
    const donation = await Donation.findById(req.params.donationId)
      .populate('donor')

    mailer.sendReceipt(donation)
    res.json(donation)
  },

  hasAuthorization(req, res, next) {
    if (req.user.roles.find(r => r === ADMIN_ROLE) ||
        req.params.donationId === req.user._id) {
      return next()
    }

    throw new UnauthorizedError
  }
}
