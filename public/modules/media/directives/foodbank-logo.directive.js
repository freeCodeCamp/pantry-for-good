import angular from 'angular';

export default angular.module('media')
	.component('foodbankLogo', {
		bindings: {
			tconfig: '=',
			media: '='
		},
		template: `<img alt="{{$ctrl.tconfig.organization}}" ng-src="{{$ctrl.media.logoPath + $ctrl.media.logoFile}}">`
	})
	.name;
