import extend from 'lodash/extend'

import User from '../models/user'
import Volunteer from '../models/volunteer'

export default {
  /**
   * Create a volunteer
   */
  async create(req, res) {
    let volunteer = new Volunteer(req.body)
    volunteer._id = req.user.id

    // Update user's hasApplied property to restrict them from applying again
    await User.findOneAndUpdate({_id: volunteer._id}, {$set: {hasApplied: true }})

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

    // get the new role and update if driver or status changed
    let role
    if (newVolunteer.driver) role = 'driver'
    else if (newVolunteer.status === 'Inactive') role = 'user'
    else role = 'volunteer'

    if (oldVolunteer.driver !== newVolunteer.driver ||
        oldVolunteer.status !== newVolunteer.status) {
      await User.findOneAndUpdate({_id: volunteer._id}, {$set: {roles: [role]}})
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
    if (!req.user.roles.find(r => r === 'admin') && req.volunteer._id !== +req.user.id) {
      return res.status(403).json({
        message: 'User is not authorized'
      })
    }
    next()
  }
}
