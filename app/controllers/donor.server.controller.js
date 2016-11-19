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
	donor._id = req.user.id;

	// Update user's role to donor and mark as this user as having applied
	User.findOneAndUpdate({_id: donor._id}, {$set: {hasApplied: true, roles: ['donor']}}, function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});

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
	Donor.find().sort('-dateReceived').populate('donations', 'eligibleForTax').exec(function(err, donors) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(donors);
		}
	});
};

/**
 * Delete donor
 */
exports.delete = function(req, res) {
	var id = req.donor._id;
	 
	User.findByIdAndRemove(id).exec(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});
	 
	Donor.findByIdAndRemove(id).exec(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}		
	});
	
	res.end();
};

/**
 * Donor middleware
 */
exports.donorById = function(req, res, next, id) {
	Donor.findById(id).populate('donations').exec(function(err, donor) {
		if (err) return next(err);
		if (!donor) return next(new Error('Failed to load donor #' + id));
		req.donor = donor;
		next();
	});
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
