(function() {
	'use strict';

	angular.module('customer').filter('capitalize', capitalize);

	function capitalize() {
		return capitalizeFilter;

		function capitalizeFilter(input) {
			if (typeof input === 'string') {
				return input.split(' ').map(function(char) {
					return char.charAt(0).toUpperCase() + char.substring(1);
				}).join(' ');
			}
			return input;
		}
	}
})();
