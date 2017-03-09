// Setting up routes
angular.module('food').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Food state routing for admin
		$stateProvider.
		state('root.foodsAdmin', {
			url: 'admin/foods',
			views: {
				'content@': {
					component: 'foodList'
				},
				resolve: {
					CurrentUser: AuthenticationProvider.requireAdminUser
				}
			}
		}).
		state('root.foodsAdminReact', {
			url: 'admin/foods-react',
			views: {
				'content@': {
					component: 'foodListReact'
				},
				resolve: {
					CurrentUser: AuthenticationProvider.requireAdminUser
				}
			}
		});
	}
]);
