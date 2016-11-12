(function() {
	'use strict';

	angular.module('questionnaire').controller('QuestionnaireController', QuestionnaireController);

	/* @ngInject */
	function QuestionnaireController(Questionnaire, Section, Field) {
		var self = this;

		// Copy section sections and fields for smart table
		self.questionnairesCopy = [].concat(self.questionnaires);
		self.sectionsCopy = [].concat(self.sections);
		self.fieldsCopy = [].concat(self.fields);

		/**** Dealing with QUESTIONNAIRES ****/
		// Create questionnaire
		self.createQuestionnaire = function() {
			var questionnaire = new Questionnaire(self.questionnaire);

			questionnaire.$save(function() {
				// If successful refresh the table
				self.findQuestionnaires();
				// Clear input fields
				delete self.questionnaire;
			}, function(errorResponse) {
				self.questionnaireError = errorResponse.data.message;
			});
		};

		// Find list of questionnaires
		self.findQuestionnaires = function() {
			// Set loading state
			self.isLoading = true;

			Questionnaire.query({}, function (questionnaires) {
				self.questionnaires = questionnaires;
				// Remove loading state after callback from the server
				self.isLoading = false;
			});
			// Remove error messages
			delete self.questionnaireError;
		};

		// Update current questionnaire
		self.updateQuestionnaire = function(questionnaire) {
			questionnaire.$update(function() {
				// If successful refresh the table
				self.findQuestionnaires();
			}, function(errorResponse) {
				self.questionnaireError = errorResponse.data.message;
			});
		};

		// Remove current questionnaire
		self.removeQuestionnaire = function(questionnaire) {
			questionnaire.$remove(function() {
				// If successful refresh the table
				self.findQuestionnaires();
			}, function (errorResponse) {
				self.questionnaireError = errorResponse.data.message;
			});
		};

		/**** Dealing with SECTIONS ****/
		// Create section
			self.createSection = function() {
				var section = new Section(self.section);

				section.$save(function() {
					// If successful refresh the table
					self.findSections();
					// Clear input fields
					delete self.section;
				}, function(errorResponse) {
					self.sectionError = errorResponse.data.message;
				});
			};

			// Find list of sections
			self.findSections = function() {
				// Set loading state
				self.isLoading = true;

				Section.query({}, function (sections) {
					self.sections = sections;
					// Remove loading state after callback from the server
					self.isLoading = false;
				});
				// Remove error messages
				delete self.sectionError;
			};

			// Update current section
			self.updateSection = function(selectedSection) {
				console.log(selectedSection);
				var section = new Section(selectedSection);

				section.$update(function() {
					// If successful refresh the table
					self.findSections();
				}, function(errorResponse) {
					self.sectionError = errorResponse.data.message;
				});
			};

			// Remove current section section
			self.removeSection = function(selectedSection) {
				var section = new Section(selectedSection);

				section.$remove(function() {
					// If successful refresh the table
					self.findSections();
				}, function (errorResponse) {
					self.sectionError = errorResponse.data.message;
				});
			};

	/**** Dealing with FIELDS ****/
	// Create field
		self.createField = function() {
			var field = new Field(self.field);

			field.$save(function() {
				// If successful refresh the table
				self.findFields();
				// Clear input fields
				delete self.field;
			}, function(errorResponse) {
				self.fieldError = errorResponse.data.message;
			});
		};

		// Update current field
		self.updateField = function(selectedField) {
			var field = new Field(selectedField);

			field.$update(function() {
				// If successful refresh the table
				self.findFields();
			}, function(errorResponse) {
				self.fieldError = errorResponse.data.message;
			});
		};

		// Find list of fields
		self.findFields = function() {
			// Set loading state
			self.isLoading = true;

			Field.query({}, function (fields) {
				self.fields = fields;
				// Remove loading state after callback from the server
				self.isLoading = false;
			});
			// Remove error messages
			delete self.fieldError;
		};

		// Remove current section section field
		self.removeField = function(selectedField) {
			var field = new Field(selectedField);

			field.$remove(function() {
				// If successful refresh the table
				self.findFields();
			}, function (errorResponse) {
				self.fieldError = errorResponse.data.message;
			});
		};
	}
})();
