'use strict';
import Settings from '../models/settings.server.model'
/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
		errorHandler = require('./errors.server.controller')
		// Settings = mongoose.model('Settings');

/**
 * Read settings
 */
exports.read = function(req, res) {
	Settings.findOne({}, function(err, settings) {
	  if (err) throw err;

		// Return settings, create from default if none are found
		if (settings) {
			res.json(settings);
		} else {
			res.json(new Settings());
		}

	});
};

/**
 * Save settings
 */
exports.save = function(req, res) {
	// If settings object already exist, update, otherwise save
	Settings.count({}, function (err, count){
    if (count>0) {
			Settings.findByIdAndUpdate(req.body._id, req.body, {new: true}, function(err, settings) {
				if (err) throw err;
				res.json(settings);
			});
		} else {
			var settings = new Settings(req.body);
			settings.save();
		}
	});
};
