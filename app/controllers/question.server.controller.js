'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Question = mongoose.model('Question'),
	Customer = mongoose.model('Customer'),
	_ = require('lodash'),
	async = require('async');

/**
 * Create a Question section
 */
exports.create = function(req, res) {
	var question = new Question(req.body);

	question.save(function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(question);
		}
	});
};

/**
 * Update a Question section
 */
exports.update = function(req, res) {
	var question = req.question;

	question = _.extend(question, req.body);

	question.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(question);
		}
	});
};

/**
 * Delete a Question section
 */
exports.delete = function(req, res) {
	var question = req.question;

	// Prevent remove if question section contains question items
	if (question.items.length) {
		return res.status(400).send({
			message: 'Section must be empty before deleting'
		});
	}

	question.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(question);
		}
	});
};

/**
 * List of Question sections
 */
exports.list = function(req, res) {
	Question.find().sort('section').exec(function(err, questions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(questions);
		}
	});
};

/**
 * Create a question item
 */
exports.createItem = function(req, res) {
	var id = req.question._id;
	var item = req.body;

	item._id = mongoose.Types.ObjectId(item._id);

	Question.findByIdAndUpdate(id, {$addToSet: {items: item}}, function(err, question) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(question);
		}
	});
};

/**
 * Update a question item
 */
exports.updateItem = function(req, res) {
	var id = req.question._id;
	var item = req.body;

	async.waterfall([
		function(done) {
			Question.findOneAndUpdate({_id: id, 'items._id': item._id}, {$set: {'items.$': item}}, function(err, question) {
				if (!question) {
					// No document found which means the question item has changed section, go on with the waterfall
					done(err);
				} else {
					// Regular update and document is found, exit the waterfall
					return res.json(question);
				}
			});
		},
		function(done) {
			// Add question item to the new question section
			Question.findByIdAndUpdate(id, {$addToSet: {items: item}}, function(err, question) {
				done(err, question);
			});
		},
		function(question, done) {
			// Remove question item from the old question section
			Question.findByIdAndUpdate(item.questionIdOld, {$pull: {items: {_id: item._id}}}, function(err) {
				done(err, question);
			});
		}
	], function(err, question) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(question);
		}
	});
};

/**
 * Delete a question item
 */
exports.deleteItem = function(req, res) {
	var id = req.question._id;

	Question.findByIdAndUpdate(id, {$pull: {items: {_id: req.itemId}}}, function(err, question) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(question);
		}
	});
};

/**
 * Question middleware
 */
exports.questionById = function(req, res, next, id) {
	console.log('questionById middleware: id: ', id);
	Question.findById(id).exec(function(err, question) {
		if (err) return next(err);
		if (!question) {
			return res.status(404).send({
				message: 'Question section not found'
			});
		}
		req.question = question;
		next();
	});
};

exports.itemById = function(req, res, next, id) {
	console.log('itemById middleware: id: ', id);
	req.itemId = id;
	next();
};
