(function() {
	'use strict';

	angular.module('users').controller('AuthenticationController', AuthenticationController);

	/* @ngInject */
	function AuthenticationController($http, Authentication, $state, $timeout) {
		var self = this;

		  function inactivityTimer () {//function for determining the user's inactivity
		    var flag;

		    // DOM Events
		    document.onmousemove = loggedIn;
		    document.onkeypress = loggedIn;

		    function logout() {
//if flag is true, then the user is still active and the timeout function runs again
					 if(flag){
		          flag = false;
		          $timeout(logout, 900000);
		       }
		       else{
						 $http.get('/auth/signout').success(function(response) {
							 //deauthenticated the user
							 	Authentication.user = null;
								//changed route to 'signin'
								$state.go('root.signin', null, { reload: true});

    }).error(function(response) {
			self.error = response.message;
		});
		       }
		    }

		   function loggedIn(){
		      flag = true;//mouse moves or keydown, the flag is true and the timeout function will fire again
		   }

		    function initialiseTimer() {
		      $timeout(logout, 900000);//angular's own timeout function. Set to 5 secs for demonstration
		       flag = false;
		    }
				initialiseTimer();//initialises timer
		}

		self.authentication = Authentication;

		// If user is signed in then redirect back home
		if (self.authentication.user) $state.go('root');

		self.signup = function() {
			$http.post('/auth/signup', self.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				self.authentication.user = response;

				//function listens for 10 mins inactivity and logs the user out
				inactivityTimer();

				var accountType = response.accountType[0].charAt(0).toUpperCase() + response.accountType[0].slice(1);

				// And redirect to create application state
				$state.go('root.create' + accountType + 'User', null, { reload: true });
			}).error(function(response) {
				self.error = response.message;
			});
		};

		self.signin = function() {
			$http.post('/auth/signin', self.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				self.authentication.user = response;
				//function listens for 10 mins inactivity and logs the user out
				inactivityTimer();

				var accountType = response.accountType[0].charAt(0).toUpperCase() + response.accountType[0].slice(1);

				// And redirect to create application or root state
				if (self.authentication.user.roles[0] === 'admin') {
					$state.go('root', null, { reload: true });
				} else {
					$state.go('root.create' + accountType + 'User', null, { reload: true });
				}
			}).error(function(response) {
				self.error = response.message;
			});
		};
	}
})();
