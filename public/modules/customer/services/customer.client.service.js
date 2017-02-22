'use strict';

// Customer service used for communicating with the application REST endpoints
angular.module('customer').factory('CustomerUser', ['$resource',
	function($resource) {
		return $resource('customer/:customerId', {
			customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('CustomerAdmin', ['$resource',
	function($resource) {
		return $resource('admin/customers/:customerId', {
			customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
