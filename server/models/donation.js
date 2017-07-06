import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema

const DonatedItemSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  value: {
    type: Number,
    required: true
  }
}, {
  _id: false
})

const DonationSchema = new Schema({
  donor: {
    type: Number,
    ref: 'User'
  },
  total: Number,
  approved: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  },
  dateReceived: {
    type: Date,
    default: Date.now
  },
  dateIssued: Date,
  items: [DonatedItemSchema]
})

DonationSchema.plugin(autoIncrement.plugin, {
  model: 'Donation',
  startAt: 1
})

export default mongoose.model('Donation', DonationSchema)
