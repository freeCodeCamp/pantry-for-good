import mongoose from 'mongoose'

const {Schema} = mongoose

const SettingsSchema = new Schema({
  organization: {
    type: String,
    trim: true
  },
  mission: {
    type: String,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  },
  thanks: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  foodBankAddress:{
    type: String,
    trim: true
  },
  clientIntakeNumber: {
    type: String,
    trim: true
  },
  supportNumber: {
    type: String,
    trim: true
  },
  location: [Number],
  gmapsApiKey: {
    type: String,
    trim: true
  },
  gmapsClientId: {
    type: String,
    trim: true
  }
})

export default mongoose.model('Settings', SettingsSchema)
// TODO: set location on save
