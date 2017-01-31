(function(){
	'use strict';

	angular.module('media').directive('foodbankLogo', logo);

	/* @ngInject */
	function logo() {
		return {
			restrict: "E",
			template: '<img alt="{{tconfig.organization}}" ng-src="{{mediaData.logoPath + mediaData.logoFile}}">',
		};
	}

})();
