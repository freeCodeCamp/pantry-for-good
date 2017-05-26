import mongoose from 'mongoose'
import uuid from 'uuid'

const {Schema} = mongoose

const FieldSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  label: {
    type: String,
    required: 'Please fill in a field label',
    trim: true
  },
  type: {
    type: String,
    required: 'Please select a field type',
    enum: ['text', 'address', 'textarea', 'date', 'radio', 'checkbox', 'foodPreferences', 'household', 'table'],
    trim: true
  },
  choices: {
    type: String,
    trim: true
  },
  rows: String,
  columns: String,
  required: {
    type: Boolean,
    default: false
  }
})

const SectionSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  name: {
    type: String,
    required: 'Please fill in a section name',
    trim: true
  },
  fields: [FieldSchema]
})

const QuestionnaireSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: 'Please fill in a questionnaire name',
    trim: true
  },
  identifier: {
    type: String,
    unique: true,
    required: 'Please fill in a short identifier',
    trim: true
  },
  sections: [SectionSchema]
})

export default mongoose.model('Questionnaire', QuestionnaireSchema)
