import mongoose from 'mongoose'

import {modelTypes, questionnaireIdentifiers} from '../../common/constants'
import locationSchema from './location-schema'
import {getValidator} from '../lib/questionnaire-helpers'
import {locateQuestionnaire} from '../lib/geolocate'

const {Schema} = mongoose

var VolunteerSchema = new Schema({
  _id: {
    type: Number,
    ref: modelTypes.USER
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
  location: locationSchema,
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Pending'
  },
  disclaimerAgree: {
    type: Boolean
  },
  customers: [{
    type: Number,
    ref: modelTypes.CUSTOMER
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
  // to populate with user roles, nicer way?
  user: {
    type: Number,
    ref: modelTypes.USER
  },
  dateReceived: {
    type: Date,
    default: Date.now
  },
  
}, {
  id: false
})

VolunteerSchema.path('fields')
  .validate(getValidator(questionnaireIdentifiers.VOLUNTEER), 'Invalid field')

/**
 * Hook a pre save method for geolocation
 */
VolunteerSchema.pre('save', async function(next) {
  const result = await locateQuestionnaire(this.fields, questionnaireIdentifiers.VOLUNTEER)
  if (result instanceof Error)
    return next(result)

  if (result)
    this.location = result

  return next()
})

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

export default mongoose.model(modelTypes.VOLUNTEER, VolunteerSchema)
