import mongoose from 'mongoose'

const {Schema} = mongoose

const PackageSchema = new Schema({
  customer: {
    type: Number,
    ref: 'Customer',
    required: true
  },
  datePacked: {
    type: Date,
    default: Date.now
  },
  dateReceived: {
    type: Date
  },
  contents: {
    type: [{type: Schema.Types.ObjectId, ref: 'FoodItem'}],
    required: true
  }
})

export default mongoose.model('Package', PackageSchema)
