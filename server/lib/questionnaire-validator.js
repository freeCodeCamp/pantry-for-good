import {flatMap} from 'lodash'

import Questionnaire from '../models/questionnaire'
import validate from '../../common/validators'

export default function getValidator(identifier) {

  return async function validator(fields) {
    const questionnaire = await Questionnaire.findOne({identifier})
    if (!questionnaire) throw new Error('Invalid questionnaire')

    const qFields = flatMap(questionnaire.sections, section => section.fields)
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
