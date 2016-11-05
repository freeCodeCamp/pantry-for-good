'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

	/**
	 * Questionnaire Schema with references to section and field
	 */
	var FieldSchema = new Schema({
	    name: {
	      type: String,
				required: 'Please fill in a field name',
	      trim: true
	    },
	    type: {
	      type: String,
				required: 'Please select a field type',
	      trim: true
	    },
	    choices: [{
	        type: String,
	        trim: true
	    }],
	    row: {
	      type: Number
	    },
	    col: {
	      type: Number
	    },
	    sectionId: {
	      type: Schema.Types.ObjectId,
	      ref: 'Section'
	    }
	  }
	);

	var SectionSchema = new Schema({
	  name: {
	    type: String,
	    required: 'Please fill in a section name',
	    trim: true
	  },
	  position: {
	    type: Number
	  },
	  questionnaireId: {
	    type: Schema.Types.ObjectId,
	    ref: 'Questionnaire'
	  }
	});

	var QuestionnaireSchema = new Schema({
		name: {
			type: String,
			unique: true,
			required: 'Please fill in a questionnaire name',
			trim: true
		},
		description: {
			type: String,
			trim: true
		}
	});

	mongoose.model('Questionnaire', QuestionnaireSchema);
	mongoose.model('Section', SectionSchema);
	mongoose.model('Field', FieldSchema);
