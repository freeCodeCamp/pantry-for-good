'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
		errorHandler = require('./errors.server.controller'),
		Volunteer = mongoose.model('Volunteer'),
		User = mongoose.model('User'),
		_ = require('lodash');

/**
 * Create a volunteer
 */
exports.create = function(req, res) {
	var volunteer = new Volunteer(req.body);
	volunteer._id = req.user.id;

	// Update user's hasApplied property to restrict them from applying again
	User.findOneAndUpdate({_id: volunteer._id}, {$set: {hasApplied: true }})
		.then(function() {
			return volunteer.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					return res.json(volunteer);
				}
			});
		})
		.catch(function (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Show the current volunteer
 */
exports.read = function(req, res) {
	res.json(req.volunteer);
};

/**
 * Update a volunteer
 */
exports.update = function(req, res) {
	var volunteer = req.volunteer;
	volunteer = _.extend(volunteer, req.body);

	// Adding fields not defined in the schema
	var schemaFields = Object.getOwnPropertyNames(Volunteer.schema.paths);
	for (var field in req.body) {
		if (volunteer.hasOwnProperty(field) && schemaFields.indexOf(field) === -1) {
			volunteer.set(field, req.body[field]);
		}
	}

	Volunteer.findOne({'_id': volunteer._id})
		.exec()
		.then(function(volunteerOld) {
			// If there's a change in driver status assign the driver role to the user
			if (volunteerOld.driver !== volunteer.driver) {
				if (volunteer.driver) {
					User.findOneAndUpdate({_id: volunteer._id}, {$set: {roles: ['driver']}})
						.then(function() {
						})
						.catch(function (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						});
				}
			}

			if (volunteerOld.status !== volunteer.status) {
				// Assign the volunteer role if volunteer is activated
				if (volunteer.status === 'Active') {
					User.findOneAndUpdate({_id: volunteer._id}, {$set: {roles: ['volunteer']}})
						.then(function() {
						})
						.catch(function (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						});
				// Revoke volunteer role if the volunteer is inactive
				} else {
					User.findOneAndUpdate({_id: volunteer._id}, {$set: {roles: ['user']}})
						.then(function() {
						})
						.catch(function (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						});
				}
			}

			return volunteer.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					return res.json(volunteer);
				}
			});
		})
		.catch(function (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * List of volunteers
 */
exports.list = function(req, res) {
	return Volunteer.find()
		.sort('-dateReceived')
		.populate('user', 'displayName')
		.exec()
		.then(function(volunteers) {
			return res.json(volunteers);
		})
		.catch(function (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Delete volunteer
 */
exports.delete = function(req, res) {
	var id = req.volunteer._id;

	return User.findByIdAndRemove(id)
		.exec()
		.then(function() {
			return Volunteer.findByIdAndRemove(id)
			.exec()
			.then(function() {
				return res.end();
			});
		})
		.catch(function (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Volunteer middleware
 */
exports.volunteerById = function(req, res, next, id) {
	Volunteer.findById(id)
		.populate('customers')
		.exec()
		.then(function(volunteer) {
			if (!volunteer) return new Error('Failed to load volunteer #' + id);
			req.volunteer = volunteer;
		})
		.catch(function (err) {
			return err;
		})
		.asCallback(next);
};

/**
 * Volunteer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.volunteer._id !== +req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
