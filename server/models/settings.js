import mongoose from 'mongoose'

import {modelTypes} from '../../common/constants'
import locationSchema from './location-schema'

const {Schema} = mongoose

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
  }
})

export default mongoose.model(modelTypes.SETTINGS, SettingsSchema)
// TODO: set location on save
