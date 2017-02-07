// Setting up routes
angular.module('questionnaire').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Questionnaire state routing
		$stateProvider.
		state('root.questionnaires', {
			url: 'admin/questionnaires',
			views: {
				'content@': {
					component: 'questionnaires'
					// template: questionnairesTemplate,
					// controller: 'QuestionnaireController as questionnaireCtrl'
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
					component: 'qTest'
					// template: qTestTemplate,
					// controller: 'qTestController as qtCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
