import packingTemplate from '../views/packing.client.view.html';

// Setting up routes
angular.module('packing').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Packing state routing
		$stateProvider.
		state('root.packing', {
			url: 'admin/packing',
			views: {
				'content@': {
					template: packingTemplate,
					controller: 'PackingController as packingCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
