import mongoose from 'mongoose'

import {modelTypes} from '../../common/constants'

const {Schema} = mongoose

const PackageSchema = new Schema({
  customer: {
    type: Number,
    ref: modelTypes.CUSTOMER,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Packed', 'Received'],
  },
  packedBy: {
    type: Number,
    ref: modelTypes.USER,
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
    type: [{type: Schema.Types.ObjectId, ref: modelTypes.FOOD_ITEM}],
    required: true
  }
})

export default mongoose.model(modelTypes.PACKAGE, PackageSchema)
