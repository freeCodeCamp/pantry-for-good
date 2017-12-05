import {pick} from 'lodash'
import {ADMIN_ROLE} from '../../common/constants'
import Donation from '../models/donation'
import Donor from '../models/donor'
import {UnauthorizedError} from '../lib/errors'
import {BadRequestError} from '../lib/errors'
import mailer from '../lib/mail/mail-helpers'

export default {
  async create(req, res) {
    let newDonation = {
      ...(pick(req.body, ['donor', 'description', 'items'])),
      total: req.body.items.reduce((acc, item) => {
        if (isNaN(Number(item.value))) {
          throw new BadRequestError
        } else {
          return acc + Number(item.value)
        }
      },0 )
    }

    if (!req.user.roles.find(r => r === ADMIN_ROLE) &&
        newDonation.donor !== req.user._id) {
      throw new UnauthorizedError
    }

    const donation = await Donation.create(newDonation)
    const donor = await Donor.findByIdAndUpdate(donation.donor,
      {$push: {donations: donation}},
      {new: true}
    )

    mailer.sendThanks({...donation, donor})

    res.json({
      donation,
      donor
    })
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
