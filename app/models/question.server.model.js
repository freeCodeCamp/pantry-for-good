'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
	// questionnaire: {
	// 	type: String,
	// 	unique: true,
	// 	required: 'Please fill in a questionnaire name',
	// 	trim: true
	// },
	section: {
		type: String,
		unique: true,
		required: 'Please fill in a section name',
		trim: true
	},
	items: [{
		type: {
			type: String,
			trim: true
		},
		title: {
			type: String,
			trim: true
		},
		choices: [{
				type: String,
		}],
		order: {
			type: Number
		}
	}]
});

mongoose.model('Question', QuestionSchema);
