import mongoose from 'mongoose'

import {modelTypes, questionnaireIdentifiers} from '../../common/constants'
import {getValidator} from '../lib/questionnaire-helpers'

const {Schema} = mongoose

var DonorSchema = new Schema({
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
  donations: [{
    type: Number,
    ref: modelTypes.DONATION
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
}, {
  id: false
})

DonorSchema.path('fields')
  .validate(getValidator(questionnaireIdentifiers.DONOR), 'Invalid field')

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

export default mongoose.model(modelTypes.DONOR, DonorSchema)
