import mongoose from 'mongoose'

import locationSchema from './location-schema'

const {Schema} = mongoose

const KeysSchema = new Schema({
  mailService: String,
  mailUsername: {
    type: String,
    trim: true
  },
  mailPassword: String
}, {
  _id: false
})

const SettingsSchema = new Schema({
  organization: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  address:{
    type: String,
    trim: true
  },
  clientIntakeNumber: {
    type: String,
    trim: true
  },
  supportNumber: {
    type: String,
    trim: true
  },
  location: locationSchema,
  gmapsApiKey: {
    type: String,
    trim: true,
    select: false
  },
  gmapsClientId: {
    type: String,
    trim: true,
    select: false
  },
  keys: {
    type: KeysSchema,
    select: false
  }
})

export default mongoose.model('Settings', SettingsSchema)
// TODO: set location on save
