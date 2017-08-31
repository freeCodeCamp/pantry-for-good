import mongoose from 'mongoose'
import moment from 'moment'

import {modelTypes, questionnaireIdentifiers} from '../../common/constants'
import locationSchema from './location-schema'
import {getValidator} from '../lib/questionnaire-helpers'
import {locateQuestionnaire} from '../lib/geolocate'

const {Schema} = mongoose

const CustomerSchema = new Schema({
  _id: {
    type: Number,
    ref: modelTypes.USER
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  location: locationSchema,
  status: {
    type: String,
    enum: ['Accepted', 'Rejected', 'Pending', 'Inactive'],
    default: 'Pending'
  },
  household: [{
    name: {
      type: String,
      trim: true
    },
    relationship: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date
    }
  }],
  disclaimerAgree: {
    type: Boolean
  },
  disclaimerSign: {
    type: String,
    trim: true
  },
  lastPacked: {
    type: Date,
    default: null
  },
  packingList: [{
    type: Schema.Types.ObjectId,
    ref: 'FoodItem'
  }],
  lastDelivered: {
    type: Date
  },
  assignedTo: {
    type: Number,
    ref: modelTypes.VOLUNTEER
  },
  foodPreferences: [Schema.Types.ObjectId],
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
  }
}, {
  id: false
})

CustomerSchema.path('fields')
  .validate(getValidator(questionnaireIdentifiers.CUSTOMER), 'Invalid field')

/**
 * Hook a pre save method for geolocation
 */
CustomerSchema.pre('save', async function(next) {
  const result = await locateQuestionnaire(this.fields, questionnaireIdentifiers.CUSTOMER)
  if (result instanceof Error)
    return next(result)

  if (result)
    this.location = result

  return next()
})

/**
 * Virtual getters & setters
 */
CustomerSchema.virtual('fullName').get(function() {
  var fullName = this.firstName ? this.firstName + ' ' : ''
  fullName += this.middleName ? this.middleName + ' ' : ''
  fullName += this.lastName ? this.lastName : ''
  return fullName
})

CustomerSchema.virtual('householdSummary').get(function() {
  var householdSummary = 'None'

  if (this.household.length) {
    householdSummary = '#' + this.household.length + ' -'
    this.household.forEach(function(dependant) {
      var ageInYears = moment().diff(dependant.dateOfBirth, 'years')
      householdSummary += ' '
      householdSummary += ageInYears ? ageInYears + 'y' : moment().diff(dependant.dateOfBirth, 'months') + 'm'
    })
  }
  return householdSummary
})

/**
 * Schema options
 */
CustomerSchema.set('toJSON', {virtuals: true})

export default mongoose.model(modelTypes.CUSTOMER, CustomerSchema)
