// Setting up routes
angular.module('packing').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Packing state routing
		$stateProvider.
		state('root.packing', {
			url: 'admin/packing',
			views: {
				'content@': {
					component: 'packingList'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
