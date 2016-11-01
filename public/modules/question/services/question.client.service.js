'use strict';

// Question service used for communicating with the question REST endpoints
angular.module('question').factory('Question', ['$resource',
	function($resource) {
		return $resource('admin/questions/:questionId', {
			questionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('QuestionItem', ['$resource',
	function($resource) {
		return $resource('admin/questions/:questionId/items/:itemId', {
			questionId: '@questionId',
			itemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
