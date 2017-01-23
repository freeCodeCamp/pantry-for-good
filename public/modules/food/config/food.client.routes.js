import foodTemplate from '../views/foods.client.view.html';

// Setting up routes
angular.module('food').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Food state routing for admin
		$stateProvider.
		state('root.foodsAdmin', {
			url: 'admin/foods',
			views: {
				'content@': {
					template: foodTemplate,
					controller: 'FoodController as foodCtrl'
				},
				resolve: {
					CurrentUser: AuthenticationProvider.requireAdminUser
				}
			}
		});
	}
]);
