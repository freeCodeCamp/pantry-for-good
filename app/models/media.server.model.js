'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Settings Schema
 */
var MediaSchema = new Schema({
	logoPath: {
		type: String,
		default: 'media/logo.png'
	}
});

mongoose.model('Media', MediaSchema);
