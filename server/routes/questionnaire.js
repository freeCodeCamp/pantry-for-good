'use strict'

/**
 * Module dependencies
 */
var express = require('express')
var questionnaire = require('../controllers/questionnaire')

var questionnaireRouter = express.Router({mergeParams: true})

// Questionnaires routes
questionnaireRouter.route('/questionnaires')
  .get(questionnaire.query)
  .post(questionnaire.create)
// Questionnaire routes
questionnaireRouter.route('/questionnaires/:questionnaireId')
  .get(questionnaire.get)
  .put(questionnaire.update)
  .delete(questionnaire.delete)

// Finish by binding the questionnaire middleware
questionnaireRouter.param('questionnaireId', questionnaire.questionnaireById)

module.exports = questionnaireRouter
