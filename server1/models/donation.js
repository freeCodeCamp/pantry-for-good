import mongoose from 'mongoose'
import autoIncrement from 'mongoose-plugin-autoinc'

import {modelTypes} from '../../common/constants'

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
    ref: modelTypes.USER
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

DonationSchema.plugin(autoIncrement, {
  model: modelTypes.DONATION,
  startAt: 1
})

export default mongoose.model(modelTypes.DONATION, DonationSchema)
