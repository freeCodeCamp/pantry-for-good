import angular from 'angular';
import {stateGo} from 'redux-ui-router';

const mapStateToThis = state => ({
	auth: state.auth,
});

const mapDispatchToThis = dispatch => ({
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

angular.module('settings').controller('ChangeSettingsController', ChangeSettingsController);

/* @ngInject */
function ChangeSettingsController($scope, $rootScope, $stateParams, $ngRedux, SettingsObject) {
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);

		// If user is not signed in then redirect to signin page
		if (!this.auth.user) this.push('root.signin');

		SettingsObject.readSettings().
			then(function successCallback(response){
				$rootScope.tconfig = response.data;
			},
			function errorCallback(response){
				console.log('GET SETTINGS: error');
			}
		);

		// Could not get this to work using self.saveSettings
		$scope.saveSettings = function () {
			SettingsObject.saveSettings($rootScope.tconfig);
		};
	};

	this.$onDestroy = () => this.unsubscribe();
}
