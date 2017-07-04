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
    type: Date
  },
  frequency: {
    type: Number,
    default: 0
  }
})

const FoodSchema = new Schema({
  category: {
    type: String,
    unique: true,
    required: 'Please fill in a category name',
    trim: true
  },
  items: [FoodItemSchema]
})

export default mongoose.model(modelTypes.FOOD, FoodSchema)
export const FoodItem = mongoose.model(modelTypes.FOOD_ITEM, FoodItemSchema)
