'use strict';

// Questionnaire service used for communicating with the questionnaire REST endpoints
angular.module('questionnaire').factory('Questionnaire', ['$resource',
	function($resource) {
		return $resource('api/questionnaires/:questionnaireId', {
			questionnaireId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('Section', ['$resource',
	function($resource) {
		return $resource('api/sections/:sectionId', {
			questionnaireId: '@questionnaireId',
			sectionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('Field', ['$resource',
	function($resource) {
		return $resource('admin/fields/:fieldId', {
			sectionId: '@sectionId',
			fieldId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
