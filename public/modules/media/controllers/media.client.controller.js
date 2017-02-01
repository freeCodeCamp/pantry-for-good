(function() {
	'use strict';

	angular.module('settings').controller('ChangeMediaController', ChangeMediaController);
	/* @ngInject */
	function ChangeMediaController($scope, $state, Authentication, MediaObject, FileUploader) {
		var self = this,
				user = Authentication.user;

		$scope.uploader = new FileUploader({url: 'api/media/uploadLogo'});

		$scope.upload = function(item) {
			item.onSuccess = function(media) {
				$scope.logoSrc = media.logoPath + media.logoFile;
			};
			item.upload();
		};

		// This provides Authentication context
		self.authentication = Authentication;
	}
})();
