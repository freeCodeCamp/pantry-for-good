import mongoose from 'mongoose'
import {flatMap} from 'lodash'

import Questionnaire from './questionnaire'
import locationSchema from './location-schema'
import validate from '../../common/validators'

const {Schema} = mongoose

var VolunteerSchema = new Schema({
  _id: {
    type: Number,
    ref: 'User'
  },
  lastName: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  accountType: [String],
  location: locationSchema,
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Inactive'
  },
  disclaimerAgree: {
    type: Boolean
  },
  driver: {
    type: Boolean
  },
  customers: [{
    type: Number,
    ref: 'Customer'
  }],
  optimized: {
    type: Boolean,
    default: false
  },

  generalNotes: {
    type: String,
    trim: true
  },
  disclaimerSign: {
    type: String,
    trim: true
  },
  disclaimerSignGuardian: {
    type: String,
    trim: true
  },
  disclaimerGuardianEmail: {
    type: String,
    trim: true
  },
  fields: [{
    meta: {
      type: String,
      required: true
    },
    value: String
  }],
  dateReceived: {
    type: Date,
    default: Date.now
  },

})

VolunteerSchema.path('fields').validate(async function(fields) {
  const questionnaire = await Questionnaire.findOne({'identifier': 'qVolunteers'})
  if (!questionnaire) return true

  const qFields = flatMap(questionnaire.sections, section => section.fields)
  // TODO: reduce qFields instead
  return fields.reduce((valid, field) => {
    if (!valid) return false

    const qField = qFields.find(f => String(f._id) === String(field.meta))
    if (!qField) return false

    const error = validate(field.value, qField)
    return !Object.keys(error).length
  }, true)
}, 'Invalid field')

/**
 * Virtual getters & setters
 */
VolunteerSchema.virtual('fullName').get(function() {
  var fullName = this.firstName ? this.firstName + ' ' : ''
  fullName += this.middleName ? this.middleName + ' ' : ''
  fullName += this.lastName ? this.lastName : ''
  return fullName
})

VolunteerSchema.virtual('fullAddress').get(function() {
  var fullAddress = this.address ? this.address + ' ' : ''
  fullAddress += this.apartmentNumber ? 'APT ' + this.apartmentNumber + ' ' : ''
  fullAddress += this.city ? this.city + ' ' : ''
  fullAddress += this.province ? this.province + ' ' : ''
  fullAddress += this.postalCode ? this.postalCode + ' ' : ''
  fullAddress += this.buzzNumber ? '#' + this.buzzNumber : ''
  return fullAddress
})

/**
 * Schema options
 */
VolunteerSchema.set('toJSON', {virtuals: true})

export default mongoose.model('Volunteer', VolunteerSchema)
