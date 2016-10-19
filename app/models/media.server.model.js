'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Settings Schema
 */
var SettingsSchema = new Schema({
	logoPath: {
		type: String,
		default: 'public/media/logo.png'
	}
});

mongoose.model('Media', SettingsSchema);
