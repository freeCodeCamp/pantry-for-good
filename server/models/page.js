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
  body: {
    type: String
  }
})

export default mongoose.model('Page', PageSchema)
