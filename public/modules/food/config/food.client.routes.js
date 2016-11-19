'use strict';

// Setting up routes
angular.module('food').config(['$stateProvider',
	function($stateProvider) {
		// Food state routing
		$stateProvider.
		state('root.foods', {
			url: 'admin/foods',
			views: {
				'content@': {
					templateUrl: 'modules/food/views/foods.client.view.html',
					controller: 'FoodController as foodCtrl'
				}
			}
		});
	}
]);
