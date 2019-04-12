
import mongoose from 'mongoose'

const Schema = mongoose.Schema

/**
 * Notification Schema
 */
export const notificationSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now()
  }
}, {
  _id: false
})
