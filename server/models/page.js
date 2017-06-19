import mongoose from 'mongoose'

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
    enum: ['page', 'email'],
    default: 'page'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  subject: String,
  body: String
})

export default mongoose.model('Page', PageSchema)
