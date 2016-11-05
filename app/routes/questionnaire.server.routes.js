'use strict';

/**
 * Module dependencies
 */
var questionnaire = require('../controllers/questionnaire.server.controller');
var section = require('../controllers/section.server.controller');
var field = require('../controllers/field.server.controller');

module.exports = function(app) {
	// Questionnaires routes
	app.route('/api/questionnaires')
		.get(questionnaire.query)
		.post(questionnaire.create);
	// Questionnaire routes
	app.route('/api/questionnaires/:questionnaireId')
		.get(questionnaire.get)
		.put(questionnaire.update)
		.delete(questionnaire.delete);

	// Sections routes
	app.route('/api/sections')
		.get(section.query)
		.post(section.create);
	// Section routes
	app.route('/api/sections/:sectionId')
		.get(section.get)
		.put(section.update)
		.delete(section.delete);

	// Fields routes
	app.route('/api/fields')
		.get(field.query)
		.post(field.create);
	// Field routes
	app.route('/api/fields/:fieldId')
		.get(field.get)
		.put(field.update)
		.delete(field.delete);

	// Finish by binding the questionnaire middleware
	app.param('sectionId', section.sectionById);
	app.param('questionnaireId', questionnaire.questionnaireById);
	app.param('fieldId', field.fieldById);
};
