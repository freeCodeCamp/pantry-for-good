(function() {
	'use strict';

	angular.module('questionnaire').controller('QuestionnaireController', QuestionnaireController);

	/* @ngInject */
	function QuestionnaireController(Questionnaire, Section, Field) {
		var self = this;

		// Copy questionnaire sections and fields for smart table
		self.questionnairesCopy = [].concat(self.questionnaires);
		// self.sectionsCopy = [].concat(self.sections);
		// self.sectionsFieldsCopy = [].concat(self.sectionsCopy);

		/**** Dealing with QUESTIONNAIRES ****/
		// Create questionnaire
		self.createQuestionnaire = function() {
			var questionnaire = new Questionnaire(self.questionnaire);

			questionnaire.$save(function() {
				// If successful refresh the table
				self.findQuestionnaire();
				// Clear input fields
				delete self.questionnaire;
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Find list of questionnaires
		self.findQuestionnaires = function() {
			// Set loading state
			self.isLoading = true;

			Questionnaire.query({}, function (questionnaires) {
				self.questionnaires = questionnaires;
				console.log('Questionnaires: ', questionnaires);
				// Remove loading state after callback from the server
				self.isLoading = false;
			});
			// Remove error messages
			delete self.error;
			delete self.errorItem;
		};

		// Update current questionnaire
		self.update = function(questionnaire) {
			questionnaire.$update(function() {
				// If successful refresh the table
				self.findQuestionnaire();
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Remove current questionnaire
		self.remove = function(questionnaire) {
			questionnaire.$remove(function() {
				// If successful refresh the table
				self.findQuestionnaire();
			}, function (errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		/**** Dealing with QUESTIONNAIRE SECTION FIELDS ****/
		// Create questionnaire section field
	// 	self.createField = function() {
	// 		var field = new QuestionnaireSectionField(self.field);
	//
	// 		section.$save(function() {
	// 			// If successful refresh the table
	// 			self.find();
	// 			// Clear input fields
	// 			delete self.field;
	// 		}, function(errorResponse) {
	// 			self.errorField = errorResponse.data.message;
	// 		});
	// 	};
	//
	// 	// Update current questionnaire section field
	// 	self.updateField = function(selectedField) {
	// 		var field = new QuestionnaireSectionField(selectedField);
	//
	// 		field.$update(function() {
	// 			// If successful refresh the table
	// 			self.find();
	// 		}, function(errorResponse) {
	// 			self.errorField = errorResponse.data.message;
	// 		});
	// 	};
	//
	// 	// Remove current questionnaire section field
	// 	self.removeField = function(selectedField) {
	// 		var field = new QuestionnaireItem(selectedField);
	//
	// 		field.$remove(function() {
	// 			// If successful refresh the table
	// 			self.find();
	// 		}, function (errorResponse) {
	// 			self.errorField = errorResponse.data.message;
	// 		});
	// 	};
	//
	// 	/**** Dealing with QUESTIONNAIRE SECTIONS ****/
	// 	// Create questionnaire section
	// 	self.createSection = function() {
	// 		var section = new QuestionnaireSection(self.section);
	//
	// 		section.$save(function() {
	// 			// If successful refresh the table
	// 			self.find();
	// 			// Clear input fields
	// 			delete self.section;
	// 		}, function(errorResponse) {
	// 			self.errorSection = errorResponse.data.message;
	// 		});
	// 	};
	//
	// 	// Update current questionnaire section
	// 	self.updateSection = function(selectedSection) {
	// 		var section = new QuestionnaireSection(selectedSection);
	//
	// 		section.$update(function() {
	// 			// If successful refresh the table
	// 			self.find();
	// 		}, function(errorResponse) {
	// 			self.errorSection = errorResponse.data.message;
	// 		});
	// 	};
	//
	// 	// Remove current questionnaire section
	// 	self.removeSection = function(selectedSection) {
	// 		var section = new QuestionnaireItem(selectedSection);
	//
	// 		section.$remove(function() {
	// 			// If successful refresh the table
	// 			self.find();
	// 		}, function (errorResponse) {
	// 			self.errorItem = errorResponse.data.message;
	// 		});
	// 	};
	}
})();
