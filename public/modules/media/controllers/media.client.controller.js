import angular from 'angular';
import {stateGo} from 'redux-ui-router';

const mapStateToThis = state => ({
	auth: state.auth,
});

const mapDispatchToThis = dispatch => ({
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

angular.module('settings').controller('ChangeMediaController', ChangeMediaController);

/* @ngInject */
function ChangeMediaController($scope, $state, $ngRedux, MediaObject, FileUploader) {
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);

		// If user is not signed in redirect to signin
		if (!this.auth.user) this.push('root.signin');
	};

	this.$onDestroy = () => this.unsubscribe();

	$scope.uploader = new FileUploader({url: 'api/media/uploadLogo'});

	$scope.upload = function(item) {
		item.onSuccess = function(media) {
			$scope.logoSrc = media.logoPath + media.logoFile;
		};
		item.upload();
	};
}
