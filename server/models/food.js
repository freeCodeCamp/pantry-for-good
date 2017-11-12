import mongoose from 'mongoose'

import {modelTypes} from '../../common/constants'

const {Schema} = mongoose

const FoodItemSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  frequency: {
    type: Number,
    default: 1
  },
  deleted: {
    type: Boolean,
    default: false
  }
})

const FoodSchema = new Schema({
  category: {
    type: String,
    required: 'Please fill in a category name',
    trim: true
  },
  items: [FoodItemSchema],
  deleted: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model(modelTypes.FOOD, FoodSchema)
export const FoodItem = mongoose.model(modelTypes.FOOD_ITEM, FoodItemSchema)