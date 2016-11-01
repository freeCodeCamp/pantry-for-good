'use strict';

// Setting up routes
angular.module('question').config(['$stateProvider',
	function($stateProvider) {
		// Question state routing
		$stateProvider.
		state('root.questions', {
			url: 'admin/questions',
			views: {
				'content@': {
					templateUrl: 'modules/question/views/questions.client.view.html',
					controller: 'QuestionController as questionCtrl'
				}
			}
		});
	}
]);
