import angular from 'angular';

const mapStateToThis = state => ({
  settings: state.settings.data,
  media: state.media.data
})

export default angular.module('media')
	.component('foodbankLogo', {
		controller: ['$ngRedux', function($ngRedux) {
      this.$onInit = () => this.unsubscribe = $ngRedux.connect(mapStateToThis)(this);
      this.$onDestroy = () => this.unsubscribe();
    }],
    template: `<img alt="{{$ctrl.settings.organization}}" ng-src="{{$ctrl.media.logoPath + $ctrl.media.logoFile}}">`
	})
	.name;
