import angular from 'angular';

import {loadSettings} from '../../../store/settings';
import {loadMedia} from '../../../store/media';

const mapStateToThis = state => ({
	auth: state.auth,
  settings: state.settings.data,
  media: state.media.data,
  fetchingSettings: state.settings.fetching,
  fetchingMedia: state.media.fetching
});

const mapDispatchToThis = dispatch => ({
  loadSettings: () => dispatch(loadSettings()),
  loadMedia: () => dispatch(loadMedia())
});

angular.module('core').controller('HeaderController', HeaderController)

/* @ngInject */
function HeaderController($ngRedux) {
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
		if (!this.settings && !this.fetchingSettings) this.loadSettings();
		if (!this.media && ! this.fetchingMedia) this.loadMedia();
	};

	this.$onDestroy = () => this.unsubscribe();

	// tests run before setUser action fires, how to do this better?
	this.auth = this.auth || {};
}
