'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');

/**
 * Donation Schema
 */
var DonationSchema = new Schema({
	type: {
		type: String,
		enum: ['Cash', 'Cash with advantage', 'Non-cash', 'Non-cash with advantage']
	},
	dateReceived: {
		type: Date
	},
	donorName: {
		type: String,
		trim: true
	},
	donorAddress: {
		type: String,
		trim: true
	},
	total: {
		type: Number
	},
	advantageValue: {
		type: Number
	},
	advantageDescription: {
		type: String,
		trim: true
	},
	eligibleForTax: {
		type: Number
	},
	description: {
		type: String,
		trim: true
	},
	appraiserName: {
		type: String,
		trim: true
	},
	appraiserAddress: {
		type: String,
		trim: true
	},
	dateIssued: {
		type: Date,
		default: Date.now
	},
	location: {
		type: String,
		trim: true
	}
});

/**
 * Schema plugins
 */
DonationSchema.plugin(autoIncrement.plugin, {
	model: 'Donation',
	startAt: 1
});

mongoose.model('Donation', DonationSchema);
