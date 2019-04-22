import {pick} from 'lodash'
import {ADMIN_ROLE} from '../../common/constants'
import {UnauthorizedError} from '../lib/errors'
import Shift from '../models/shift'

export default {
  async create(req, res) {
    let newShift = {
      ...(pick(req.body, ['status', 'start', 'end'])),
    }
    if (!req.user.roles.find(r => r === ADMIN_ROLE) &&
      newDonation.donor !== req.user._id) {
      throw new UnauthorizedError
    }
    let shift = await Shift.create(newShift)
    res.json({
        shift
    })
  },

  async assign(req, res) {
    const shift = await Shift.findByIdAndUpdate(
      shift.params.shiftId,
      {$set: {filled: true, volunteer: req.volunteerId}}
    )
    res.json(shift)
  },

  async query(req, res) {
    const shifts = await Shifts.find()
    res.json(shifts)
  },

  async delete(req, res) {
    const id = res.shift._id
    const shift = await Shift.findByIdAndRemove(id)
    res.json(shift)
  },

  hasAuthorization(req, res, next) {
    if (req.user.roles.find(r => r === ADMIN_ROLE) ||
        req.params.donationId === req.user._id) {
      return next()
    }

    throw new UnauthorizedError
  }
}