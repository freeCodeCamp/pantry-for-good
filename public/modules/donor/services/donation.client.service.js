(function() {
	'use strict';

	// Donation service used for communicating with the donation REST endpoints
	angular.module('donor').factory('Donation', Donation);
	
	/* @ngInject */
	function Donation($http, $stateParams) {
		var service = {
			saveDonation: saveDonation,
			sendReceipt: sendReceipt
		};
		
		return service;
		
		function saveDonation(donation) {
			return $http.post('admin/donations', donation);
		}
		
		function sendReceipt(donation) {
			return $http.put('admin/donations/' + $stateParams.donorId, donation);
		}
	}
})();

