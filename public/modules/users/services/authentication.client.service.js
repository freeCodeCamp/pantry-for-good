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
	this.requireAdminUser = ['$q', '$state', '$timeout', '$ngRedux', function ($q, $state, $timeout, $ngRedux) {
		var deferred = $q.defer();
		const user = $ngRedux.getState().auth.user;
		if (!user) {
			// Not signed in
			$timeout(function() {
				deferred.reject();
				$state.go('root.signin');
			}, 100);
		} else if (user.roles.indexOf('admin') < 0) {
			// Not an admin user
 			$timeout(function() {
				deferred.reject();
				$state.go('root');
			}, 100);
		} else {
			// admin user logged in. Set the promise value to the user data
			deferred.resolve(user);
		}
		return deferred.promise;
	}];

	// This is used in ui-router resolve to ensure a user is logged in
	this.requireLoggedIn = ['$q', '$state', '$timeout', '$ngRedux', function ($q, $state, $timeout, $ngRedux) {
		var deferred = $q.defer();
		const user = $ngRedux.getState().auth.user;
		if (!user) {
			// Not signed in
			$timeout(function() {
				deferred.reject();
				$state.go('root.signin');
			}, 100);
		} else {
			deferred.resolve(user);
		}
		return deferred.promise;
	}];
}]);

