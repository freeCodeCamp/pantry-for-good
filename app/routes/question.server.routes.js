'use strict';

/**
 * Module dependencies
 */
var question = require('../controllers/question.server.controller');

module.exports = function(app) {
	// Question routes
	app.route('/admin/questions')
		.get(question.list)
		.post(question.create);
	app.route('/admin/questions/:questionId')
		.put(question.update)
		.delete(question.delete);
	app.route('/admin/questions/:questionId/items')
		.post(question.createItem);
	app.route('/admin/questions/:questionId/items/:itemId')
		.put(question.updateItem)
		.delete(question.deleteItem);

	// Finish by binding the question middleware
	app.param('questionId', question.questionById);
	app.param('itemId', question.itemById);
};
