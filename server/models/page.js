import mongoose from 'mongoose'

import {modelTypes, pageTypes} from '../../common/constants'

const {Schema} = mongoose

const PageSchema = new Schema({
  identifier: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [pageTypes.PAGE, pageTypes.EMAIL],
    default: pageTypes.PAGE
  },
  disabled: {
    type: Boolean,
    default: false
  },
  subject: String,
  body: String
})

export default mongoose.model(modelTypes.PAGE, PageSchema)
