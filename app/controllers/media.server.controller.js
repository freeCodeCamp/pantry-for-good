'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
		errorHandler = require('./errors.server.controller'),
		Settings = mongoose.model('Media');

/**
 * Read media data
 */
exports.read = function(req, res) {
	Settings.findOne({}, function(err, media) {
	  if (err) throw err;

		res.json(media);
	});
};

/**
 * Save media data
 */
exports.save = function(req, res) {
	Settings.findOneAndUpdate({}, req.body, function(err, media) {
	  if (err) throw err;

		res.json(media);
	});
};
