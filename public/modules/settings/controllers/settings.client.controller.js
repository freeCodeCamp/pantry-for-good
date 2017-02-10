import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {loadSettings, saveSettings} from '../../../store/settings';

const mapStateToThis = state => ({
	auth: state.auth,
	settings: state.settings.data,
	fetching: state.settings.fetching
});

const mapDispatchToThis = dispatch => ({
	loadSettings: () => dispatch(loadSettings()),
	_saveSettings: settings => dispatch(saveSettings(settings)),
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

angular.module('settings').controller('ChangeSettingsController', ChangeSettingsController);

/* @ngInject */
function ChangeSettingsController($ngRedux) {
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);

		// If user is not signed in then redirect to signin page
		if (!this.auth.user) this.push('root.signin');

		this.loadSettings();
		this.saveSettings = () => this._saveSettings(this.formModel);
	};

	this.$doCheck = () => {
		if (this.settings && !this.fetching && !this.formModel) {
			this.formModel = {...this.settings};
		}
	};

	this.$onDestroy = () => this.unsubscribe();
}
