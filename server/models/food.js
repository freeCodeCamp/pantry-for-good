'use strict'

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema

/**
 * Food Schema
 */
var FoodSchema = new Schema({
  category: {
    type: String,
    unique: true,
    required: 'Please fill in a category name',
    trim: true
  },
  items: [{
    name: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date
    },
    frequency: {
      type: Number,
      default: 0
    }
  }]
})

export default mongoose.model('Food', FoodSchema)
