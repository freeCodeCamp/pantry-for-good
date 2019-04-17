import {flatMap} from 'lodash'

import Questionnaire from '../models/questionnaire'
import validate from '../../common/validators'

async function getQuestionnaireFields (identifier, type) {
  const questionnaire = await Questionnaire.findOne({identifier})
  if (!questionnaire) throw new Error('Invalid questionnaire')

  // questionnaire = Customer Application

  const allFields = flatMap(questionnaire.sections, section => section.fields)

  // allFields = All different fields... ie address, birthday, etc

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

    // qFields = all different fields... ie address, birthday, etc
    // console.log(fields)
    // console.log(qFields)

    if (!fields.every(field => qFields.find(qField => qField._id === field.meta))) {
      //console.log("In 1st")
      return false
    }

    return qFields.reduce((valid, qField) => {
      // console.log(valid + ", " + qField)
      if (!valid) {
        return false
      }

      // if(qField.label == "Date of Birth") {
      //   console.log(fields)
      // }
      const field = fields.find(f => String(qField._id) === String(f.meta)) || {}
      if(qField.label == "Date of Birth") {
        // console.log(field)
      }      
      const error = validate(field.value, qField)

      return !Object.keys(error).length
    }, true)
  }
}
