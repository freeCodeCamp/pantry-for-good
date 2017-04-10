'use strict'

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema

/**
 * Donor Schema
 */

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
  middleName: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  apartmentNumber: {
    type: String,
    trim: true
  },
  buzzNumber: {
    type: Number
  },
  city: {
    type: String,
    trim: true
  },
  province: {
    type: String,
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
  },
  telephoneNumber: {
    type: String,
    trim: true
  },
  mobileNumber: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  referredBy: {
    type: String,
    trim: true
  },
  dateReceived: {
    type: Date,
    default: Date.now
  },
  donations: [{
    type: Number,
    ref: 'Donation'
  }]
},
  // Mongoose options
  { strict: false }
)


/**
 * Virtual getters & setters
 */
DonorSchema.virtual('fullName').get(function() {
  var fullName = this.firstName ? this.firstName + ' ' : ''
  fullName += this.middleName ? this.middleName + ' ' : ''
  fullName += this.lastName ? this.lastName : ''
  return fullName
})

DonorSchema.virtual('fullAddress').get(function() {
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
DonorSchema.set('toJSON', {virtuals: true})

export default mongoose.model('Donor', DonorSchema)
