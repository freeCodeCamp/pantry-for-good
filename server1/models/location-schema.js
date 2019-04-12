import mongoose from 'mongoose'

const {Schema} = mongoose

export default Schema({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }
}, {
  _id: false
})
