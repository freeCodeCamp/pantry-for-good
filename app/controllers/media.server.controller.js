'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
		errorHandler = require('./errors.server.controller'),
		Media = mongoose.model('Media');

/**
 * Read media data
 */
exports.read = function(req, res) {
	Media.findOne({}, function(err, media) {
	  if (err) throw err;

		if (media) {
			res.json(media);
		} else {
			res.json(new Media());
		}
	});
};

/**
 * Save media data
 */
exports.save = function(req, res) {
	// If settings object already exist, update, otherwise save
	Media.count({}, function (err, count){
    if (count>0) {
			Media.findByIdAndUpdate(req.body._id, req.body, function(err, media) {
			  if (err) throw err;
				res.json(media);
			});
		} else {
			var media = new Media(req.body);
			media.save();
		}
	});
};
