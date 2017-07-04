import {difference, extend} from 'lodash'

import {ADMIN_ROLE, clientRoles, volunteerRoles} from '../../common/constants'
import User from '../models/user'
import Volunteer from '../models/volunteer'

export default {
  /**
   * Create a volunteer
   */
  async create(req, res) {
    let volunteer = new Volunteer(req.body)
    volunteer._id = req.user.id

    await User.findOneAndUpdate(
      {_id: volunteer._id},
      {$push: {roles: clientRoles.VOLUNTEER}}
    )

    const savedVolunteer = await volunteer.save()
    res.json(savedVolunteer)
  },

  /**
   * Show the current volunteer
   */
  read(req, res) {
    res.json(req.volunteer)
  },

  /**
   * Update a volunteer
   */
  async update(req, res) {
    const volunteer = extend(req.volunteer, req.body)

    const oldVolunteer = await Volunteer.findById(volunteer._id)
    const newVolunteer = await volunteer.save()

    if (newVolunteer.driver && !oldVolunteer.driver) {
      await User.findOneAndUpdate({_id: volunteer._id}, {$push: {roles: 'driver'}})
    } else if (!newVolunteer.driver && oldVolunteer.driver) {
      await User.findOneAndUpdate({_id: volunteer._id}, {$pull: {roles: 'driver'}})
    }

    res.json(newVolunteer)
  },

  /**
   * List of volunteers
   */
  async list(req, res) {
    const volunteers = await Volunteer.find()
      .sort('-dateReceived')
      .populate('user', 'displayName')

    res.json(volunteers)
  },

  /**
   * Delete volunteer
   */
  async delete(req, res) {
    const id = req.volunteer._id

    const volunteer = await Volunteer.findByIdAndRemove(id)
    await User.findByIdAndRemove(id)

    res.json(volunteer)
  },

  /**
   * Volunteer middleware
   */
  async volunteerById(req, res, next, id) {
    const volunteer = await Volunteer.findById(id)
      .populate('customers')

    if (!volunteer) return res.status(404).json({
      message: 'Not found'
    })

    req.volunteer = volunteer
    next()
  },

  /**
   * Volunteer authorization middleware
   */
  async hasAuthorization(req, res, next) {
    if (!req.user.roles.find(r => r === ADMIN_ROLE) &&
        req.volunteer._id !== +req.user.id) {
      return res.status(403).json({
        message: 'User is not authorized'
      })
    }
    next()
  }
}
