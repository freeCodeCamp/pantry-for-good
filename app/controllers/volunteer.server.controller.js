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
	User.findOneAndUpdate({_id: volunteer._id}, {$set: {hasApplied: true}}, function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});
	
	volunteer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(volunteer);
		}
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

	Volunteer.findOne({'_id': volunteer._id}).exec(function(err, volunteerOld) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		// If there's a change in driver status assign the driver role to the user
		if (volunteerOld.driver !== volunteer.driver) {
			if (volunteer.driver) {
				User.findOneAndUpdate({_id: volunteer._id}, {$set: {roles: ['driver']}}, function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}
				});
			}
		}

		if (volunteerOld.status !== volunteer.status) {
			// Assign the volunteer role if volunteer is activated
			if (volunteer.status === 'Active') {
				User.findOneAndUpdate({_id: volunteer._id}, {$set: {roles: ['volunteer']}}, function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}
				});
			// Revoke volunteer role if the volunteer is inactive
			} else {
				User.findOneAndUpdate({_id: volunteer._id}, {$set: {roles: ['user']}}, function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}
				});
			}
		}
	});

	volunteer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(volunteer);
		}
	});
};

/**
 * List of volunteers
 */
exports.list = function(req, res) {
	Volunteer.find().sort('-dateReceived').populate('user', 'displayName').exec(function(err, volunteers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(volunteers);
		}
	});
};

/**
 * Delete volunteer
 */
exports.delete = function(req, res) {
	var id = req.volunteer._id;
	 
	User.findByIdAndRemove(id).exec(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});
	 
	Volunteer.findByIdAndRemove(id).exec(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}		
	});
	
	res.end();
};

/**
 * Volunteer middleware
 */
exports.volunteerById = function(req, res, next, id) {
	Volunteer.findById(id).populate('customers').exec(function(err, volunteer) {
		if (err) return next(err);
		if (!volunteer) return next(new Error('Failed to load volunteer #' + id));
		req.volunteer = volunteer;
		next();
	});
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
