import mongoose from 'mongoose'

import {modelTypes} from '../../common/constants'

const {Schema} = mongoose

const PackageSchema = new Schema({
  customer: {
    type: Number,
    ref: modelTypes.CUSTOMER,
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
