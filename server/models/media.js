import mongoose from 'mongoose'

import {modelTypes} from '../../common/constants'

const {Schema} = mongoose

/**
 * Settings Schema
 */
const MediaSchema = new Schema({
  path: {
    type: String,
    default: 'media/'
  },
  logo: {
    type: String,
    default: 'logo.png'
  },
  signature: {
    type: String,
    default: 'signature.png'
  },
  favicon: {
    type: String,
    default: 'favicon.ico'
  }
})

export default mongoose.model(modelTypes.MEDIA, MediaSchema)
