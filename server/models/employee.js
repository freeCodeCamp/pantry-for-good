import mongoose from 'mongoose'

import {modelTypes} from '../../common/constants'

const {Schema} = mongoose

var employeeSchema = new Schema({
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

/**
 * Virtual getters & setters
 */
employeeSchema.virtual('fullName').get(function() {
  var fullName = this.firstName ? this.firstName + ' ' : ''
  fullName += this.middleName ? this.middleName + ' ' : ''
  fullName += this.lastName ? this.lastName : ''
  return fullName
})

employeeSchema.set('toJSON', {virtuals: true})

export default mongoose.model(modelTypes.EMPLOYEE, employeeSchema)
