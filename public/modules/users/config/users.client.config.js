'use strict';

// Configuring the User menu
angular.module('users').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for users
		Menus.addMenuItem('user', 'Apply', '/create', 'item', 'root.createREPLACETYPEUser', '', ['user'], 0);
		Menus.addMenuItem('user', 'Edit Application', '/edit', 'item', 'root.editREPLACETYPEUser({REPLACEIDId: sidebarCtrl.user._id})', '', ['user'], 0);
	}
]);

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// 403 Unauthorized behaviour
								$location.path('403');	
								break;
							case 500:
								// 500 Server error
								$location.path('500');
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);

