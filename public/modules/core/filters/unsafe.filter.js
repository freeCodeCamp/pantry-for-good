
(function() {
	'use strict';

	angular.module('core').filter('unsafe', unsafe);

	function unsafe($sce) {
		return $sce.trustAsHtml;
	}
})();