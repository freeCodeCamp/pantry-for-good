(function() {
	'use strict';

	angular.module('settings').controller('ChangeMediaController', ChangeMediaController);
	/* @ngInject */
	function ChangeMediaController($scope, $rootScope, $stateParams, $state, Authentication, MediaObject, FileUploader) {
		$scope.uploader = new FileUploader({url: 'api/media/uploadLogo'});
		$scope.uploader.queueLimit = 1;

		var self = this,
				user = Authentication.user;

		// This provides Authentication context
		self.authentication = Authentication;

		// If user is not signed in redirect to signin
		if(!user) $state.go('root.signin');

		MediaObject.readMedia().
			then(function successCallback(response){
				$rootScope.mediaData = response.data;
			},
			function errorCallback(response){
				console.log('GET MEDIA DATA: error');
			}
		);

		$scope.saveMedia = function () {
			MediaObject.saveMedia($rootScope.mediaData);
		};
	}
})();
