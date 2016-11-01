(function() {
	'use strict';

	angular.module('question').controller('QuestionController', QuestionController);

	/* @ngInject */
	function QuestionController(Question, QuestionItem) {
		var self = this;

		// Copy question item for smart table
		self.itemsCopy = [].concat(self.items);

		// Create question item
		self.createItem = function() {
			var item = new QuestionItem(self.item);

			item.$save(function() {
				// If successful refresh the table
				self.find();
				// Clear input fields
				delete self.item;
			}, function(errorResponse) {
				self.errorItem = errorResponse.data.message;
			});
		};

		// Update current question item
		self.updateItem = function(selectedItem) {
			var item = new QuestionItem(selectedItem);

			item.$update(function() {
				// If successful refresh the table
				self.find();
			}, function(errorResponse) {
				self.errorItem = errorResponse.data.message;
			});
		};

		// Remove current question item
		self.removeItem = function(selectedItem) {
			var item = new QuestionItem(selectedItem);

			item.$remove(function() {
				// If successful refresh the table
				self.find();
			}, function (errorResponse) {
				self.errorItem = errorResponse.data.message;
			});
		};

		// Create question section
		self.create = function() {
			var question = new Question(self.question);

			question.$save(function() {
				// If successful refresh the table
				self.find();
				// Clear input fields
				delete self.question;
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Find list of question categories and items
		self.find = function() {
			// Set loading state
			self.isLoading = true;

			Question.query({}, function (questions) {
				self.questions = questions;
				// Flatten obtained data for ng-repeat
				self.items = [];
				for (var question in questions) {
					question = questions[question];
					if (question.items) {
						for (var item in question.items) {
							item = question.items[item];
							item.sectionName = question.section;
							item.questionId = question._id;
							item.questionIdOld = question._id;
							self.items.push(item);
						}
					}
				}
				// Remove loading state after callback from the server
				self.isLoading = false;
			});
			// Remove error messages
			delete self.error;
			delete self.errorItem;
		};

		// Update current question section
		self.update = function(question) {
			question.$update(function() {
				// If successful refresh the table
				self.find();
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Remove current question section
		self.remove = function(question) {
			question.$remove(function() {
				// If successful refresh the table
				self.find();
			}, function (errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
	}
})();
