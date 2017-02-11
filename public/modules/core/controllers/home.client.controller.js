import angular from 'angular';

angular.module('core').controller('HomeController', HomeController);

const mapStateToThis = state => ({
	auth: state.auth,
	settings: state.settings.data,
	media: state.media.data
});

/* @ngInject */
function HomeController($ngRedux) {
	this.$onInit = () => this.unsubscribe = $ngRedux.connect(mapStateToThis)(this);
	this.$onDestroy = () => this.unsubscribe();

	// tests run before setUser action fires, how to do this better?
	this.auth = this.auth || {user: null};
}
