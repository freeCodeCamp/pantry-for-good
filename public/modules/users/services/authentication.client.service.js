'use strict';

// Authentication service for user variables
angular.module('users').provider('Authentication', ['$windowProvider', function($windowProvider) {
	var _this = this;
	var $window = $windowProvider.$get();

	// If a user is logged on, the server inserts a script tag in the html that sets window.user
	_this._data = {user: $window.user};
	
	// When used as a factory, Authentication will provide the return value from $get
	this.$get = function () {
		return _this._data;
	};

	// This is used in ui-router resolve to ensure an admin role is logged in
	this.requireAdminUser = ['$q', '$state', '$timeout', function ($q, $state, $timeout) {
		var deferred = $q.defer();
		if (!_this._data.user) {
			// Not signed in
			$timeout(function() {
				deferred.reject();
				$state.go('root.signin');
			}, 100);
		} else if (_this._data.user.roles.indexOf('admin') < 0) {
			// Not an admin user
 			$timeout(function() {
				deferred.reject();
				$state.go('root');
			}, 100);
		} else {
			// admin user logged in. Set the promise value to the user data
			deferred.resolve(_this._data.user);
		}
		return deferred.promise;		
	}];
}]);

