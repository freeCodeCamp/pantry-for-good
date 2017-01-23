import angular from 'angular';

export default angular.module('core').filter('unsafe', unsafe).name;

	function unsafe($sce) {
		return $sce.trustAsHtml;
	}
