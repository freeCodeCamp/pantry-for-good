import {flatMap} from 'lodash'
import {utc} from 'moment'

/**
 * Convert api representation of client fields for populating forms
 *
 * @param {object} model
 * @param {object} questionnaire
 * @returns {object} map of field_ids -> values
 */
export const toForm = (model, questionnaire) => {
  const fields = flatMap(questionnaire.sections, section => section.fields)

  const withValues = fields.map(field => {
    const modelField = model.fields.find(f => f.meta._id === field._id)

    if (!modelField) return {[field._id]: ''}

    if (field.type === 'date')
      return {[field._id]: utc(modelField.value).format('YYYY-MM-DD')}

    if (field.type === 'checkbox')
      return {[field._id]: modelField.value.split(',').map(v => v.trim())}

    return {[field._id]: modelField.value}
  })

  return Object.assign({}, ...withValues)
}

/**
 * Convert redux form representation of client fields to nested api format
 *
 * @param {object} fields
 * @returns {array<object>}
 */
export const fromForm = fields =>
  Object.keys(fields).map(k => {
    const field = fields[k]
    const value = Array.isArray(field) ? field.join(', ') : field

    return {
      value,
      meta: {_id: k}
    }
  })
