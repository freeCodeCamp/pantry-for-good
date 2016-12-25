'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Section = mongoose.model('Section'),
	Field = mongoose.model('Field'),
	_ = require('lodash');

// Create a section
exports.create = function(req, res) {
	var section = new Section(req.body);

	section.save(function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(section);
		}
	});
};

// Update a section
exports.update = function(req, res) {
	var section = req.section;
	section = _.extend(section, req.body);

	section.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(section);
		}
	});
};

// Delete a section
exports.delete = function(req, res) {
	var section = req.section;

	// Prevent remove if section contains fields
	Field.count({ section: section._id }, function (err, count) {
		if (count > 0) {
			return res.status(400).send({
				message: 'Section must not contain any fields before deleting'
			});
		}
	});

	section.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(section);
		}
	});
};

// Query sections
exports.query = function(req, res) {
	Section.find({}).populate('questionnaire')
		.exec()
		.then(function (sections) {
			return res.json(sections);
		})
		.catch(function (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

// Get specified section
exports.get = function(req, res) {
	res.json(req.section);
};

// Section middleware
exports.sectionById = function(req, res, next, id) {
	// Make sure id is a valid ObjectId before proceeding
	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		res.status(404).send({
			message: 'Invalid section id'
		});
		return next();
	}

	Section.findById(id)
		.populate({
			path: 'questionnaire'
		})
		.exec()
		.then(function(section) {
			if (!section) {
				return res.status(404).send({
					message: 'Section not found'
				});
			}
			req.section = section;
			return section;
		})
		.catch(function(err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			return err;
	})
	.asCallback(next);
};
