import {flatMap} from 'lodash'
import {utc} from 'moment'

/**
 * Convert api representation of client model for populating forms
 *
 * @param {object} model
 * @param {object} questionnaire
 * @returns {object} form compatible model
 */
export const toForm = (model, questionnaire) => {
  const qFields = flatMap(questionnaire.sections, section => section.fields)

  return {
    ...model,
    fields: toFormFields(model, qFields),
    household: householdToForm(model)
  }
}

/**
 * Convert redux form representation of client model to nested api format
 *
 * @param {object} fields
 * @returns {array<object>} api compatible model
 */
export const fromForm = form => ({
  ...form,
  fields: fromFormFields(form.fields)
})

function toFormFields(model, qFields) {
  const withValues = qFields.map(qField => {
    const modelField = model.fields.find(field => field.meta._id === qField._id)

    if (!modelField) return {[qField._id]: ''}

    if (qField.type === 'date')
      return {[qField._id]: utc(modelField.value).format('YYYY-MM-DD')}

    if (qField.type === 'checkbox')
      return {[qField._id]: modelField.value.split(',').map(v => v.trim())}

    return {[qField._id]: modelField.value}
  })

  return Object.assign({}, ...withValues)
}

function householdToForm(model) {
  return model.household && model.household.map(dependent => ({
    ...dependent,
    dateOfBirth: utc(dependent.dateOfBirth).format('YYYY-MM-DD')
  }))
}

function fromFormFields(fields) {
  return Object.keys(fields).map(k => {
    const field = fields[k]
    const value = Array.isArray(field) ? field.join(', ') : field

    return {
      value,
      meta: {_id: k}
    }
  })
}
