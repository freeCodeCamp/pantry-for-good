'use strict'

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema

/**
 * Volunteer Schema
 */

var VolunteerSchema = new Schema({
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
  dateOfBirth: {
    type: Date
  },
  email: {
    type: String,
    trim: true
  },
  contactPreference: {
    type: String,
    trim: true
  },
  referredBy: {
    type: String,
    trim: true
  },
  volunteerReason: {
    type: String,
    trim: true
  },
  disclaimerAgree: {
    type: Boolean
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
  // Driver and delivery information
  driver: {
    type: Boolean
  },
  customers: [{
    type: Number,
    ref: 'Customer'
  }],
  generalNotes: {
    type: String,
    trim: true
  },
  // Application specific information
  _id: {
    type: Number,
    ref: 'User'
  },
  dateReceived: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Inactive'
  }
},
  // Mongoose options
  { strict: false }
)


/**
 * Virtual getters & setters
 */
VolunteerSchema.virtual('fullName').get(function() {
  var fullName = this.firstName ? this.firstName + ' ' : ''
  fullName += this.middleName ? this.middleName + ' ' : ''
  fullName += this.lastName ? this.lastName : ''
  return fullName
})

VolunteerSchema.virtual('fullAddress').get(function() {
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
VolunteerSchema.set('toJSON', {virtuals: true})

export default mongoose.model('Volunteer', VolunteerSchema)
