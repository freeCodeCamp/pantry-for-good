import mongoose from 'mongoose'

import {modelTypes} from '../../common/constants'

const {Schema} = mongoose

const itemSchema = new Schema({
  _id: {
    type: Number
  },
  description: {
    type:String, 
    trim: true
  },
  manufacturerName: {
    type: Number, 
    ref: modelTypes.VENDOR
  },
  partName: {
    type: String, 
    trim: true
  },
  manufacturingYear: {
    type: Number
  },
  manufacturerPartNumber: {
    type: String, 
    trim: true
  }
})

export default  mongoose.model(modelTypes.ITEM, itemSchema)
