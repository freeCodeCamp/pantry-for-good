import {utc} from 'moment'

import {fieldTypes} from './constants'

export default (value, meta) => {
  let errors = {}

  if (meta.required)
    errors = Object.assign(errors, validateRequired(value, meta))
  if (meta.type === fieldTypes.ADDRESS || meta.type === fieldTypes.TEXT)
    errors = Object.assign(errors, validateText(value, meta))
  if (meta.type === fieldTypes.TEXTAREA)
    errors = Object.assign(errors, validateTextarea(value, meta))
  if (meta.type === fieldTypes.DATE)
    errors = Object.assign(errors, validateDate(value, meta))
  if (meta.type === fieldTypes.RADIO)
    errors = Object.assign(errors, validateRadio(value, meta))
  // if (meta.type === 'checkbox')
  //   errors = Object.assign(errors, validateCheckbox(value, meta))

  return errors
}

function validateRequired(value, meta) {
  if (!value || !value.trim().length) {
    const lastChar = meta.label.charAt(meta.label.length - 1)
    const msg = lastChar === 's' ? 'are required' : 'is required'
    return {[meta._id]: `${meta.label} ${msg}`}
  }
}

function validateText(value, meta) {
  if (value && value.trim().length > 100)
    return {[meta._id]: `${meta.label} should be less than 100 characters`}
}

function validateTextarea(value, meta) {
  if (value && value.trim().length > 1000)
    return {[meta._id]: `${meta.label} should be less than 1000 characters`}
}

function validateDate(value, meta) {
  if (value && !utc(value).isValid())
    return {[meta._id]: `${meta.label} must be a valid date`}
}

function validateRadio(value, meta) {
  const options = meta.choices.split(',').map(o => o.trim())
  if (value && !options.find(o => o === value))
    return {[meta._id]: `${meta.label} must be one of ${meta.choices}`}
}

function validateCheckbox(value, meta) {
  console.log('value, meta', value, meta)

  const options = meta.choices.split(',').map(o => o.trim())
  // const selections = value && value.split(',').map(s => s.trim())
  if (value && !value.every(v => options.find(o => o === v)))
    return {[meta._id]: `Invalid selection for ${meta.label}`}
}
