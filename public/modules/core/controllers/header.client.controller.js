import angular from 'angular';

angular.module('core').controller('HeaderController', HeaderController)

const mapStateToThis = state => ({
	auth: state.auth
});

/* @ngInject */
function HeaderController($ngRedux) {
	this.$onInit = () => this.unsubscribe = $ngRedux.connect(mapStateToThis)(this);
	this.$onDestroy = () => this.unsubscribe();

	// tests run before setUser action fires, how to do this better?
	this.auth = this.auth || {};
}
