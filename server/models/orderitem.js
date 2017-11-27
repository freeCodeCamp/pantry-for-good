import mongoose from 'mongoose'

import {modelTypes} from '../../common/constants'

const {Schema} = mongoose

var OrderItemSchema = new Schema({
  vendorOrderID: {
    type: Number,
    ref: modelTypes.VENDORORDER
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