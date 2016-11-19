'use strict';

// Volunteer service used for communicating with the volunteer REST endpoints
angular.module('volunteer').factory('VolunteerUser', ['$resource',
	function($resource) {
		return $resource('volunteer/:volunteerId', {
			volunteerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('VolunteerAdmin', ['$resource',
	function($resource) {
		return $resource('admin/volunteers/:volunteerId', {
			volunteerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
