'use strict';

/**
 * Module dependencies
 */
var express = require('express');
var questionnaire = require('../controllers/questionnaire.server.controller');
var section = require('../controllers/section.server.controller');
var field = require('../controllers/field.server.controller');

var questionnaireRouter = express.Router({mergeParams: true});

// Questionnaires routes
questionnaireRouter.route('/questionnaires')
	.get(questionnaire.query)
	.post(questionnaire.create);
// Questionnaire routes
questionnaireRouter.route('/questionnaires/:questionnaireId')
	.get(questionnaire.get)
	.put(questionnaire.update)
	.delete(questionnaire.delete);

// Sections routes
questionnaireRouter.route('/sections')
	.get(section.query)
	.post(section.create);
// Section routes
questionnaireRouter.route('/sections/:sectionId')
	.get(section.get)
	.put(section.update)
	.delete(section.delete);

// Fields routes
questionnaireRouter.route('/fields')
	.get(field.query)
	.post(field.create);
// Field routes
questionnaireRouter.route('/fields/:fieldId')
	.get(field.get)
	.put(field.update)
	.delete(field.delete);

// Finish by binding the questionnaire middleware
questionnaireRouter.param('sectionId', section.sectionById);
questionnaireRouter.param('questionnaireId', questionnaire.questionnaireById);
questionnaireRouter.param('fieldId', field.fieldById);

module.exports = questionnaireRouter;
