'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(
	function($http, $rootScope) {

		// Get template config from db
		$http.get('api/settings/').then(
			function successCallback(response){
				$rootScope.tconfig = response.data;
			},
			function errorCallback(response){
				console.log('Get Template Config: error');
			}
		);
	}

);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
