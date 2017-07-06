import {ADMIN_ROLE} from '../../common/constants'
import Donation from '../models/donation'
import {UnauthorizedError} from '../lib/errors'
import {sendReceipt/*, sendThanks*/} from '../lib/mail/mail-helpers'

export default {
  async create(req, res) {
    const donation = await Donation.create({
      ...req.body,
      total: req.body.items.reduce((acc, item) => acc + item.value, 0)
    }).populate('donor')

    // sendThanks(donation)

    res.json(donation)
  },

  async approve(req, res) {
    const donation = await Donation.findByIdAndUpdate(
      req.params.donationId,
      {$set: {approved: true, dateIssued: Date.now()}},
      {new: true}
    ).populate('donor')

    sendReceipt(donation)

    res.json(donation)
  },

  hasAuthorization(req, res, next) {
    if (req.user.roles.find(r => r === ADMIN_ROLE) ||
        req.user._id === req.body.donor)
      return next()

    throw new UnauthorizedError
  }
}
