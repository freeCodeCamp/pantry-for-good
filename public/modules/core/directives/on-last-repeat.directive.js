(function() {
	'use strict';

	angular.module('core').directive('onLastRepeat', onLastRepeat);

	/* @ngInject */
	function onLastRepeat () {
		return function(scope) {
			if (scope.$last) {
				scope.$emit('repeatLastDone');
			}
		};
	}
})();
