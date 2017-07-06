import Donation from '../models/donation'
// import {sendRe} from ''

export default {
  async create(req, res) {
    const donation = await Donation.create({
      ...req.body,
      total: req.body.items.reduce((acc, item) => acc + item.value, 0)
    })

    res.json(donation)
  },

  async approve(req, res) {
    const donation = await Donation.findByIdAndUpdate(
      req.params.donationId,
      {$set: {approved: true, dateIssued: Date.now()}},
      {new: true}
    )

    res.json(donation)
  },

  hasAuthorization(req, res, next) {
    if (req.user.roles.find(r => r === 'admin'))
      return next()
    if (req.user._id === req.body.donor)
      return next()
    return res.status(403).end()
  }
}
