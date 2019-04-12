import mongoose from 'mongoose'
import uuid from 'uuid'
import {values} from 'lodash'

import {fieldTypes, widgetTypes, modelTypes} from '../../common/constants'

const {Schema} = mongoose

const FieldSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: [...values(fieldTypes), ...values(widgetTypes)]
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
    required: true,
    trim: true
  },
  fields: [FieldSchema]
})

const QuestionnaireSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  identifier: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  sections: [SectionSchema]
})

export default mongoose.model(modelTypes.QUESTIONNAIRE, QuestionnaireSchema)
