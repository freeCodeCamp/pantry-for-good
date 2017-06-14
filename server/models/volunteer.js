import mongoose from 'mongoose'

import questionnaireValidator from '../lib/questionnaire-validator'
import locationSchema from './location-schema'

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

VolunteerSchema.path('fields')
  .validate(questionnaireValidator('qVolunteers'), 'Invalid field')

/**
 * Virtual getters & setters
 */
VolunteerSchema.virtual('fullName').get(function() {
  var fullName = this.firstName ? this.firstName + ' ' : ''
  fullName += this.middleName ? this.middleName + ' ' : ''
  fullName += this.lastName ? this.lastName : ''
  return fullName
})

/**
 * Schema options
 */
VolunteerSchema.set('toJSON', {virtuals: true})

export default mongoose.model('Volunteer', VolunteerSchema)
