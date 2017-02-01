'use strict';

// Setting up routes
angular.module('questionnaire').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Questionnaire state routing
		$stateProvider.
		state('root.questionnaires', {
			url: 'admin/questionnaires',
			views: {
				'content@': {
					templateUrl: 'modules/questionnaire/views/questionnaires.client.view.html',
					controller: 'QuestionnaireController as questionnaireCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		}).
		state('root.qtest', {
			url: 'admin/qtest',
			views: {
				'content@': {
					templateUrl: 'modules/questionnaire/views/qtest.client.view.html',
					controller: 'qTestController as qtCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
