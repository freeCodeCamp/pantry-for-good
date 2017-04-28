import mongoose from 'mongoose'

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

export default mongoose.model('Food', FoodSchema)
export const FoodItem = mongoose.model('FoodItem', FoodItemSchema)
