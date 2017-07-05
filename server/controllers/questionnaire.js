import {extend} from 'lodash'

import {NotFoundError} from '../lib/errors'
import Questionnaire from '../models/questionnaire'

export default {
// Create questionnaire
  async create(req, res) {
    const questionnaire = new Questionnaire(req.body)
    const savedQuestionnaire = await questionnaire.save()

    res.json(savedQuestionnaire)
  },

  // Update a questionnaire
  async update(req, res) {
    const questionnaire = extend(req.questionnaire, req.body)

    const savedQuestionnaire = await questionnaire.save()

    res.json(savedQuestionnaire)
  },

  // Query questionnaires
  async query(req, res) {
    const questionnaires = await Questionnaire.find()

    res.json(questionnaires)
  },

  // Get specified questionnaire
  async get(req, res) {
    res.json(req.questionnaire)
  },

  // Questionnaire middleware
  async questionnaireById(req, res, next, id) {
    const questionnaire = await Questionnaire.findById(id)

    if (!questionnaire) throw new NotFoundError

    req.questionnaire = questionnaire
    next()
  }
}
