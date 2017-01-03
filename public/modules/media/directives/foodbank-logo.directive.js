(function(){
	'use strict';

	angular.module('media').directive('foodbankLogo', logo);

	/* @ngInject */
	function logo(MediaObject) {
		return {
			restrict: "E",
			template: '<img alt="{{tconfig.organization}}" ng-src="{{logoSrc}}">',
			scope: true,
			link: function(scope) {
				MediaObject.get( function(media) {
					scope.logoSrc = media.logoPath + media.logoFile;
				});
			}
		};
	}

})();
