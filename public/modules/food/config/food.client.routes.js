'use strict';

// Setting up routes
angular.module('food').config(['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider) {
		// Food state routing
		$stateProvider.
		state('root.foods', {
			url: 'admin/foods',
			views: {
				'content@': {
					templateUrl: 'modules/food/views/foods.client.view.html',
					controller: 'FoodController as foodCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
]);
