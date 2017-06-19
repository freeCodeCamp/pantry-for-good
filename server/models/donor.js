import mongoose from 'mongoose'

import questionnaireValidator from '../lib/questionnaire-validator'

const {Schema} = mongoose

var DonorSchema = new Schema({
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
  donations: [{
    type: Number,
    ref: 'Donation'
  }],
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

DonorSchema.path('fields')
  .validate(questionnaireValidator('qDonors'), 'Invalid field')

/**
 * Virtual getters & setters
 */
DonorSchema.virtual('fullName').get(function() {
  var fullName = this.firstName ? this.firstName + ' ' : ''
  fullName += this.middleName ? this.middleName + ' ' : ''
  fullName += this.lastName ? this.lastName : ''
  return fullName
})

DonorSchema.set('toJSON', {virtuals: true})

export default mongoose.model('Donor', DonorSchema)
