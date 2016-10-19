'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
		errorHandler = require('./errors.server.controller'),
		Settings = mongoose.model('Media');

/**
 * Read settings
 */
exports.read = function(req, res) {
	Settings.findOne({}, function(err, media) {
	  if (err) throw err;

		res.json(media);
	});
};

/**
 * Save settings
 */
exports.save = function(req, res) {
	Settings.findOneAndUpdate({}, req.body, function(err, media) {
	  if (err) throw err;

		res.json(media);
	});
};
