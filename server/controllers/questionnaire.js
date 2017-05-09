import {extend} from 'lodash'
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

  // Delete a questionnaire
  // exports.delete = function(req, res) {
  //   var questionnaire = req.questionnaire

  //   // Prevent remove if there are sections for the questionnaire
  //   if (questionnaire.sections.length) {
  //     return res.status(400).send({
  //       message: 'Questionnaire must not contain any sections before deleting'
  //     })
  //   }

  //   questionnaire.remove(function(err) {
  //     if (err) {
  //       return res.status(400).send({
  //         message: errorHandler.getErrorMessage(err)
  //       })
  //     } else {
  //       res.json(questionnaire)
  //     }
  //   })
  // }

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

    if (!questionnaire) return res.status(404).json({
      message: 'Not found'
    })

    req.questionnaire = questionnaire
    next()
  }
}
