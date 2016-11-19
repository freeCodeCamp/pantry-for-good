'use strict';

// Donor service used for communicating with the donor REST endpoints
angular.module('donor').factory('DonorUser', ['$resource',
	function($resource) {
		return $resource('donor/:donorId', {
			donorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('DonorAdmin', ['$resource',
	function($resource) {
		return $resource('admin/donors/:donorId', {
			donorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
