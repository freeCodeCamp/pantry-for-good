import mongoose from 'mongoose'

import {modelTypes, questionnaireIdentifiers} from '../../common/constants'

const {Schema} = mongoose

var vendorSchema = new Schema({
  _id: {
    type: Number,
    ref: modelTypes.USER
  },
  name: {
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
  phone: {
    type: String
    trim: true
  },
  street: {
    type: String, 
    trim: true
  },
  city: {
    type: String, 
    trim: true
  }, 
  state: {
    type: String, 
    trim: true
  },
  zipCode: {
    type: String, 
    trim: true
  },
  country: {
    type: String, 
    trim: true
  }
})

/**
 * Virtual getters & setters
 */
vendorSchema.virtual('fullAddress').get(function() {
  var fullAddress = this.street ? this.street + ' ' : ''
  fullAddress += this.city ? this.city + ', ' : ''
  fullAddress += this.state ? this.state + ' ' : ''
  fullAddress += this.zipCode ? this.zipCode : ''
  return fullAddress
})

vendorSchema.set('toJSON', {virtuals: true})

export default mongoose.model(modelTypes.VENDOR, vendorSchema)
