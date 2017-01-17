'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
		errorHandler = require('./errors.server.controller'),
		Donor = mongoose.model('Donor'),
		User = mongoose.model('User'),
		_ = require('lodash');

/**
 * Create a donor
 */
exports.create = function(req, res) {
	var donor = new Donor(req.body);
	if (!req.body.manualAdd){
		donor._id = req.user.id;
		// Update user's hasApplied property to restrict them from applying again
		User.findOneAndUpdate({_id: donor._id}, {$set: {hasApplied: true, roles: ['donor']}})
			.then(function() {
				return donor.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						return res.json(donor);
					}
				});
			})
			.catch(function (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			});
		}else{
		donor.save(function(err){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
				} else {
					return res.json(donor);
				}
		});
	}
	};

/**
 * Show the current donor
 */
exports.read = function(req, res) {
	res.json(req.donor);
};

/**
 * Update a donor
 */
exports.update = function(req, res) {
	var donor = req.donor;

	donor = _.extend(donor, req.body);

	// Adding fields not defined in the schema
	var schemaFields = Object.getOwnPropertyNames(Donor.schema.paths);
	for (var field in req.body) {
		if (donor.hasOwnProperty(field) && schemaFields.indexOf(field) === -1) {
			donor.set(field, req.body[field]);
		}
	}

	donor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(donor);
		}
	});
};

/**
 * List of donors
 */
exports.list = function(req, res) {
	return Donor.find()
		.sort('-dateReceived')
		.populate('donations', 'eligibleForTax')
		.exec()
		.then(function(donors) {
			return res.json(donors);
		})
		.catch(function (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Delete donor
 */
exports.delete = function(req, res) {
	var id = req.donor._id;

	return User.findByIdAndRemove(id)
		.exec()
		.then(function() {
			return Donor.findByIdAndRemove(id)
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
 * Donor middleware
 */
exports.donorById = function(req, res, next, id) {
	Donor.findById(id)
		.populate('donations')
		.exec()
		.then(function(donor) {
			if (!donor) return new Error('Failed to load donor #' + id);
			req.donor = donor;
		})
		.catch(function (err) {
			return err;
		})
		.asCallback(next);
};

/**
 * Donor authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.donor._id !== +req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
