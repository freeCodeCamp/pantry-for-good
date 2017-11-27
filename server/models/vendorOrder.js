import mongoose from 'mongoose'

import {modelTypes} from '../../common/constants'

const {Schema} = mongoose

const VendorOrderSchema = new Schema({
  vendorOrderID: {
    type: Number,
    ref: modelTypes.USER
  },
  OrderingEmployee: {
    type: Number,
    ref: modelTypes.EMPLOYEE
  },
  Vendor: {
    type: Number,
    ref: modelTypes.VENDOR
  },
  Status: {
    type:String
  },
  placementDate: {
    type: Date,
    default: Date.now
  },
  delivered: {
    type: Boolean,
    default: false
  }
  deliveryDate: {
    type: Date,
    default: null 
  }
})
