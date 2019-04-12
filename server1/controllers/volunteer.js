import {difference, extend, omit} from 'lodash'

import {ForbiddenError, NotFoundError} from '../lib/errors'
import {ADMIN_ROLE, clientRoles} from '../../common/constants'
import User from '../models/user'
import Volunteer from '../models/volunteer'
import {updateFields} from '../lib/update-linked-fields'

export default {
  /**
   * Create a volunteer
   */
  async create(req, res) {
    let volunteer = new Volunteer(omit(req.body, ['status', 'customers']))
    volunteer._id = req.user.id
    volunteer.user = req.user.id

    await User.findOneAndUpdate(
      {_id: volunteer._id},
      {$push: {roles: clientRoles.VOLUNTEER}}
    )

    const savedVolunteer = await volunteer.save()
    updateFields(clientRoles.VOLUNTEER,req.body.fields,volunteer._id)
    res.json(savedVolunteer)
  },

  /*
   * Adds a Volunteer shift
   */
  async addShift(req, res) {

    //const volunteer = extend(req.volunteer, req.body)
    const new_volunteer = req.body
    const shift = new_volunteer.shift

    const old_volunteer = await Volunteer.findById(new_volunteer._id)
    const shifts = old_volunteer.shift
    shifts.push(shift)

    const updatedVolunteer = await Volunteer.findOneAndUpdate(
      { _id: new_volunteer._id},
      { $set: { shift: shifts}})

    res.json(updatedVolunteer)
  },  

  /*
   * Deletes a volunteer shift
   */
  async deleteShift(req, res) {
    const new_volunteer = req.body
    const del_shift = new_volunteer.del_shift

    const old_volunteer = await Volunteer.findById(new_volunteer._id)
    const shifts = old_volunteer.shift

    var del_time = new Date(del_shift.start)
    var new_shifts = []

    for(var i = 0; i < shifts.length; i++) {
      var new_time = new Date(shifts[i].date)
      if(del_time.getTime() === new_time.getTime()) {
        continue
      }
      else {
        new_shifts.push(shifts[i])
      }
    }

    const updatedVolunteer = await Volunteer.findOneAndUpdate(
      { _id: new_volunteer._id},
      { $set: {shift: new_shifts}})

    res.json(updatedVolunteer)
  },

  /*
   * Updates a Volunteer shift
   */
  async updateShift(req, res) {
    const new_volunteer = req.body
    const times = new_volunteer.times

    const old_volunteer = await Volunteer.findById(new_volunteer._id)
    const shifts = old_volunteer.shift

    var old_date = new Date(times.oldTime)

    for(var i = 0; i < shifts.length; i++) {
      var new_time = new Date(shifts[i].date)
      if(old_date.getTime() === new_time.getTime()) {
        shifts[i].date = times.newTime
      }
    }

    const updatedVolunteer = await Volunteer.findOneAndUpdate(
      { _id: new_volunteer._id},
      { $set: {shift: shifts}})
    
    res.json(updatedVolunteer)
  },  

  /**
   * Show the current volunteer
   */
  async read(req, res) {
    if (!req.user.roles.find(r => r === ADMIN_ROLE))
      return res.json(req.volunteer)

    const {roles} = await User.findById(req.volunteer._id).lean()

    res.json({
      ...req.volunteer.toObject(),
      roles
    })
  },

  /**
   * Update a volunteer
   */
  async update(req, res) {
    const volunteer = extend(req.volunteer, req.body)

    const user = await User.findById(volunteer._id).lean()
    const newVolunteer = await volunteer.save()
    //Volunteer.findByIdAndUpdate({ _id: 10017}, { $set : { lastName: "hi"}})

    if (!volunteer.roles || !req.user.roles.find(r => r === ADMIN_ROLE)) {
      updateFields(clientRoles.VOLUNTEER,req.body.fields,volunteer._id)
      return res.json(newVolunteer)
    }
    const oldRoles = difference(user.roles, volunteer.roles)
    const newRoles = difference(volunteer.roles, user.roles)
    const roles = difference(user.roles.concat(newRoles), oldRoles)

    if (newRoles.length || oldRoles.length){
      await User.findByIdAndUpdate(volunteer._id, {$set: {roles}})
    }
    updateFields(clientRoles.VOLUNTEER,req.body.fields,volunteer._id)
    res.json({
      ...newVolunteer.toObject(),
      roles
    })
  },

  /**
   * List of volunteers
   */
  async list(req, res) {
    const volunteers = await Volunteer.find()
      .sort('-dateReceived')
      .populate('user', 'roles')

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

    if (!volunteer) throw new NotFoundError

    req.volunteer = volunteer
    next()
  },

  /**
   * Volunteer authorization middleware
   */
  async hasAuthorization(req, res, next) {
    if (!req.user.roles.find(r => r === ADMIN_ROLE) &&
        req.volunteer._id !== +req.user.id) {
      throw new ForbiddenError
    }
    next()
  }

}
