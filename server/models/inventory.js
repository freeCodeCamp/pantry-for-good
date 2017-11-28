import mongoose from 'mongoose'

import {modelTypes} from '../../common/constants'

const {Schema} = mongoose

var inventorySchema = new Schema({
  _id: {
    type: Number
  },
  itemID: {
    type: Number,
    ref: modelTypes.ITEM
  },
  quantity: {
    type: Number,
    default: 0
  }
})

export default mongoose.model(modelTypes.INVENTORY, inventorySchema)
