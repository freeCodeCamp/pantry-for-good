'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
		errorHandler = require('./errors.server.controller'),
		Settings = mongoose.model('Settings');

/**
 * Read settings
 */
exports.read = function(req, res) {
	Settings.findOne({}, function(err, settings) {
	  if (err) throw err;

		res.json(settings);
	});
};

/**
 * Save settings
 */
exports.save = function(req, res) {
	Settings.findOneAndUpdate({}, req.body, function(err, settings) {
	  if (err) throw err;

		res.json(settings);
	});
};
