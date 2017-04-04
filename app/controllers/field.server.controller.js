'use strict';
import {Field} from '../models/questionnaire.server.model'

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	seed = require('../models/seed'),
	// Field = mongoose.model('Field'),
	_ = require('lodash');


	Field.count({}, function (err, count) {
		if (count < 1 && process.env.NODE_ENV === 'development') {
			console.log('Seeding Fields');
			Field.insertMany(seed.fields, function (err) {
				if (err) throw err;
			});
		}
	});


// Create a field
exports.create = function(req, res) {
	var field = new Field(req.body);

	field.save(function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(field);
		}
	});
};

// Update a field
exports.update = function(req, res) {
	var field = req.field;
	field = _.extend(field, req.body);

	field.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(field);
		}
	});
};

// Delete a field
exports.delete = function(req, res) {
	var field = req.field;

	field.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(field);
		}
	});
};

// Query fields
exports.query = function(req, res) {
	Field.find({})
		.populate({
			path: 'section',
			populate: { path: 'questionnaire' }
		})
		.exec()
		.then(function (fields) {
			return res.json(fields);
		})
		.catch(function (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

// Get specified field
exports.get = function(req, res) {
	return res.json(req.field);
};

// Field middleware
exports.fieldById = function(req, res, next, id) {
	// Make sure id is a valid ObjectId before proceeding
	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		res.status(404).send({
			message: 'Invalid field id'
		});
		return next();
	}

	Field.findById(id)
		.populate({
			path: 'section',
			populate: { path: 'questionnaire' }
		})
		.exec()
		.then(function(field) {
			if (!field) {
				res.status(404).send({
					message: 'Field not found'
				});
			}
			req.field = field;
			return field;
		})
		.catch(function(err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			return err;
		})
		.asCallback(next);
};
