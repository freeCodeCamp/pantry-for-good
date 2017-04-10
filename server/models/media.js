'use strict'

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema

/**
 * Settings Schema
 */
var MediaSchema = new Schema({
  logoPath: {
    type: String,
    default: 'media/'
  },
  logoFile: {
    type: String,
    default: 'logo.png'
  }
})

export default mongoose.model('Media', MediaSchema)
