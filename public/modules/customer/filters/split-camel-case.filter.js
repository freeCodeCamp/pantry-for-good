(function() {
	'use strict';

	angular.module('customer').filter('splitCamelCase', splitCamelCase);

	function splitCamelCase() {
		return splitCamelCaseFilter;

		function splitCamelCaseFilter(string) {
			return string.replace(/([A-Z])/g, ' $1').replace(/^./, function(char) {
				return char.toUpperCase();
			});
		}
	}
})();
