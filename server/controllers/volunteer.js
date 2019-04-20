import {difference, extend, omit} from 'lodash'

import {ForbiddenError, NotFoundError, BadRequestError} from '../lib/errors'
import {ADMIN_ROLE, clientRoles} from '../../common/constants'
import User from '../models/user'
import Volunteer from '../models/volunteer'
import {updateFields} from '../lib/update-linked-fields'

import config from '../config'

import mailer from '../lib/mail/mail-helpers'

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


  async massUpload(req, res) {
    const volunteer = req.body
    var docs = volunteer.docs
    var max = 0

    await Volunteer.find({}, function(err, volunteers) {
      max = volunteers.sort( (a, b) => a._id > b._id ? 1 : -1)[volunteers.length-1]._id + 1
    })


    let newDocs = docs.map(vol => new Volunteer(vol))
    for(var i = 0; i < newDocs.length; i++) {
      newDocs[i]._id = max
      max = max + 1
    }

    await Volunteer.insertMany(newDocs, function(err) {
      if(err) {
        res.status(400).json({message: "Unable to mass import in Database"})
      } else {
        res.status(200).json({message: "Successful mass import!"})
      }
    })    
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

  async emailShiftReminder(req, res) {
    if (!config.sendgrid.API_KEY) {
      return res.status(500).json({message: "This site does not have email capability at this time. Please contact the site owner for assistance."})
    }

    // const token = (await randomBytes(20)).toString('hex')

    // // Lookup user by email
    if (!req.body.email) throw new BadRequestError('Email is required')

    const volunteer = await Volunteer.findOne({email: req.body.email})

    await mailer.sendShiftReminder(volunteer, req.body.shift)
    res.send({message: 'Shift reminder email sent'})    
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

  async getAllVolunteers(req, res) {
    const volunteers = await Volunteer.find({})
      .sort('firstName')

    res.json(volunteers)
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