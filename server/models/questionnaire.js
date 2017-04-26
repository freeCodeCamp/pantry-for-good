import mongoose from 'mongoose'

const {Schema} = mongoose

const FieldSchema = new Schema({
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
  position: {
    type: Number,
    required: 'Position is required'
  },
  rows: [String],
  columns: [String],
  required: {
    type: Boolean,
    default: false
  }
})

const SectionSchema = new Schema({
  name: {
    type: String,
    required: 'Please fill in a section name',
    trim: true
  },
  position: {
    type: Number,
    required: 'Position is required'
  },
  fields: [FieldSchema],
  logicReq: {
    type: Boolean,
    default: false
  }
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
  description: {
    type: String,
    trim: true
  },
  sections: [SectionSchema],
  logicReq: {
    type: Boolean,
    default: false
  }
})

export const Questionnaire = mongoose.model('Questionnaire', QuestionnaireSchema)
