import extend from 'lodash/extend'

import Donor from '../models/donor'
import User from '../models/user'

export default {
  /**
   * Create a donor
   */
  async create(req, res) {
    const donor = new Donor({
      ...req.body,
      _id: req.user.id
    })

    const savedDonor = await donor.save()

    // Update user's role to donor and mark as this user as having applied
    await User.findOneAndUpdate({_id: donor._id}, {$set: {hasApplied: true }})

    res.json(savedDonor)
  },

  /**
   * Show the current donor
   */
  read(req, res) {
    res.json(req.donor)
  },

  /**
   * Update a donor
   */
  async update(req, res) {
    const donor = extend(req.donor, req.body)
    const savedDonor = await donor.save()
    res.json(savedDonor)
  },

  /**
   * List of donors
   */
  async list(req, res) {
    const donors = await Donor.find()
      .sort('-dateReceived')
      .populate('donations', 'eligibleForTax')

    res.json(donors)
  },

  /**
   * Delete donor
   */
  async delete(req, res) {
    const id = req.donor._id

    await User.findByIdAndRemove(id)
    await Donor.findByIdAndRemove(id)

    res.json(req.donor)
  },

  /**
   * Donor middleware
   */
  async donorById(req, res, next, id) {
    const donor = await Donor.findById(id)
      .populate('donations')

    if (!donor) return res.status(404).json({
      message: 'Not found'
    })

    req.donor = donor
    next()
  },

  /**
   * Donor authorization middleware
   */
  hasAuthorization(req, res, next) {
    if (req.donor._id !== +req.user.id) {
      return res.status(403).json({
        message: 'User is not authorized'
      })
    }

    next()
  }
}