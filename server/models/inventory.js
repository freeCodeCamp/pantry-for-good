import mongoose from 'mongoose'

import {modelTypes, questionnaireIdentifiers} from '../../common/constants'

const {Schema} = mongoose

var InventorySchema = new Schema({
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
}
