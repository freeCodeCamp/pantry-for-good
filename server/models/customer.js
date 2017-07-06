import mongoose from 'mongoose'
import nodeGeocoder from 'node-geocoder'
import moment from 'moment'

import {fieldTypes, modelTypes, questionnaireIdentifiers} from '../../common/constants'
import {ValidationError} from '../lib/errors'
import locationSchema from './location-schema'
import {getFieldsByType, getValidator} from '../lib/questionnaire-helpers'

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
    type: Date
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
})

CustomerSchema.path('fields')
  .validate(//() => false, 'Invalid field')
    getValidator(questionnaireIdentifiers.CUSTOMER), 'Invalid field')

// Initialize geocoder options for pre save method
const geocoder = nodeGeocoder({
  provider: 'google',
  formatter: null
})

/**
 * Hook a pre save method to construct the geolocation of the address
 */
CustomerSchema.pre('save', async function(next) {
  if (process.env.NODE_ENV === 'test') return next()

  const addressFields = await getFieldsByType(
      questionnaireIdentifiers.CUSTOMER, this.fields, fieldTypes.ADDRESS)

  const address = addressFields.map(field => field.value).join(', ')

  const [result] = await geocoder.geocode(address)

  if (!result) return next(new ValidationError({
    fields: Object.assign({}, ...addressFields.map((field, i) => ({
      [field.meta]: i === 0 ? 'Address not found' : ' '}
    )))
  }))

  const {latitude, longitude} = result
  this.location = {lat: latitude, lng: longitude}
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
