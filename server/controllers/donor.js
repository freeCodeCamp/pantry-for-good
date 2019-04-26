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



  async massUpload(req, res) {
    const donor = req.body
    var docs = donor.docs
    var max = 0

    await Donor.find({}, function(err, donors) {
      max = donors.sort( (a, b) => a._id > b._id ? 1 : -1)[donors.length-1]._id + 1
    })


    let newDocs = docs.map(don => new Donor(don))
    for(var i = 0; i < newDocs.length; i++) {
      newDocs[i]._id = max
      max = max + 1
    }

    // res.status(200).json({message: "Successful mass import!"})

    await Donor.insertMany(newDocs, function(err) {
      if(err) {
        res.status(400).json({message: "Unable to mass import in Database"})
      } else {
        res.status(200).json({message: "Successful mass import!"})
      }
    })    
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
