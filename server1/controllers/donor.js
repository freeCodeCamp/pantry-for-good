import extend from 'lodash/extend'
import {omit} from 'lodash'

import {ForbiddenError, NotFoundError} from '../lib/errors'
import {ADMIN_ROLE, clientRoles} from '../../common/constants'
import Donor from '../models/donor'
import User from '../models/user'
import {updateFields} from '../lib/update-linked-fields'

export default {
  /**
   * Create a donor
   */
  async create(req, res) {
    const donor = new Donor({
      ...(omit(req.body, ['status', 'donations'])),
      _id: req.user.id
    })

    const savedDonor = await donor.save()

    await User.findOneAndUpdate({_id: donor._id}, {$push: {roles: clientRoles.DONOR}})
    updateFields(clientRoles.DONOR,req.body.fields,donor._id)
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
    updateFields(clientRoles.DONOR,req.body.fields,donor._id)
    res.json(savedDonor)
  },

  /**
   * List of donors
   */
  async list(req, res) {
    const donors = await Donor.find()
      .sort('-dateReceived')
      .populate('donations')

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

    if (!donor) throw new NotFoundError

    req.donor = donor
    next()
  },

  /**
   * Donor authorization middleware
   */
  hasAuthorization(req, res, next) {
    if (req.user.roles.find(r => r === ADMIN_ROLE) || req.donor._id === +req.user.id)
      return next()

    throw new ForbiddenError
  }
}
