import angular from 'angular';

// Customer service used for communicating with the application REST endpoints
angular.module('customer').factory('CustomerUser', ['$resource',
	function($resource) {
		return $resource('api/customer/:customerId', {
			customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('CustomerAdmin', ['$resource',
	function($resource) {
		return $resource('api/admin/customers/:customerId', {
			customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
