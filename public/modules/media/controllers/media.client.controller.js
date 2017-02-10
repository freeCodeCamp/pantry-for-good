import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {setMedia, loadMedia} from '../../../store/media';

const mapStateToThis = state => ({
	auth: state.auth,
	media: state.media.data,
	settings: state.settings.data
});

const mapDispatchToThis = dispatch => ({
	loadMedia: () => dispatch(loadMedia()),
	setMedia: media => dispatch(setMedia(media)),
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

angular.module('settings').controller('ChangeMediaController', ChangeMediaController);

/* @ngInject */
function ChangeMediaController($ngRedux, FileUploader) {
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);

		// If user is not signed in redirect to signin
		if (!this.auth.user) this.push('root.signin');
		if (!this.media) this.loadMedia();
	};

	this.$onDestroy = () => this.unsubscribe();

	this.uploader = new FileUploader({url: 'api/media/uploadLogo'});

	this.upload = item => {
		item.onSuccess = media => {
			this.setMedia(media.logoPath, media.logoFile);
		};

		item.upload();
	};
}
