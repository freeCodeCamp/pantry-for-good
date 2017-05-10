import mongoose from 'mongoose'
import {flatMap} from 'lodash'

import Questionnaire from './questionnaire'
import validate from '../../common/validators'

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

DonorSchema.path('fields').validate(async function(fields) {
  const questionnaire = await Questionnaire.findOne({'identifier': 'qDonors'})
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
DonorSchema.virtual('fullName').get(function() {
  var fullName = this.firstName ? this.firstName + ' ' : ''
  fullName += this.middleName ? this.middleName + ' ' : ''
  fullName += this.lastName ? this.lastName : ''
  return fullName
})

DonorSchema.set('toJSON', {virtuals: true})

export default mongoose.model('Donor', DonorSchema)
