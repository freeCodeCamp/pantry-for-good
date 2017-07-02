import {flatMap} from 'lodash'

import Questionnaire from '../models/questionnaire'
import validate from '../../common/validators'

async function getQuestionnaireFields (identifier, type) {
  const questionnaire = await Questionnaire.findOne({identifier})
  if (!questionnaire) throw new Error('Invalid questionnaire')

  const allFields = flatMap(questionnaire.sections, section => section.fields)
  return type ? allFields.filter(field => field.type === type) : allFields
}

/**
 * @export
 * @param {string} identifier questionnaire identifier
 * @param {[object]} modelFields the fields to select from
 * @param {string=} type field type
 * @returns {Promise<[object]>}
 */
export async function getFieldsByType(identifier, modelFields, type) {
  const qFields = await getQuestionnaireFields(identifier, type)

  return qFields.reduce((acc, qField) => {
    const modelField = modelFields.find(modelField => modelField.meta === qField._id)
    if (modelField) return acc.concat(modelField)
    return acc
  }, [])
}

export function getValidator(identifier) {
  return async function validator(fields) {
    const qFields = await getQuestionnaireFields(identifier)

    if (!fields.every(field => qFields.find(qField => qField._id === field.meta))) {
      return false
    }

    return qFields.reduce((valid, qField) => {
      if (!valid) return false

      const field = fields.find(f => String(qField._id) === String(f.meta)) || {}
      const error = validate(field.value, qField)

      return !Object.keys(error).length
    }, true)
  }
}
