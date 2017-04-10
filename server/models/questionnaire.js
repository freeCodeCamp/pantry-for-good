'use strict'

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema

/**
 * Questionnaire Schema with references to section and field
 */
var FieldSchema = new Schema({
  label: {
    type: String,
    required: 'Please fill in a field label',
    trim: true
  },
  name: {
    type: String,
    required: 'Please fill in a field name',
    trim: true
  },
  type: {
    type: String,
    required: 'Please select a field type',
    enum: ['Text', 'Textarea', 'Date', 'Radio Buttons', 'Checkboxes', 'Lookup', 'Table'],
    trim: true
  },
  choices: {
    type: String,
    trim: true
  },
  row: {
    type: Number,
    required: 'Row is required'
  },
  column: {
    type: Number,
    required: 'Column is required'
  },
  span: {
    type: Number,
    default: 1,
    required: 'Span is required'
  },
  section: {
    type: Schema.Types.ObjectId,
    ref: 'Section'
  },
  logicReq: {
    type: Boolean,
    default: false
  }
}
)

var SectionSchema = new Schema({
  name: {
    type: String,
    required: 'Please fill in a section name',
    trim: true
  },
  position: {
    type: Number,
    required: 'Position is required'
  },
  questionnaire: {
    type: Schema.Types.ObjectId,
    ref: 'Questionnaire'
  },
  logicReq: {
    type: Boolean,
    default: false
  }
})

var QuestionnaireSchema = new Schema({
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
  logicReq: {
    type: Boolean,
    default: false
  }
})

export const Questionnaire = mongoose.model('Questionnaire', QuestionnaireSchema)
export const Section = mongoose.model('Section', SectionSchema)
export const Field = mongoose.model('Field', FieldSchema)
