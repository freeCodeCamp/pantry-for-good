(function() {
	'use strict';

	angular.module('core').directive('dateField', dateField);

	/* @ngInject */
	function dateField($filter, moment) {
		return {
      require: 'ngModel',
			link: function (scope, element, attrs, ngModelController) {
				ngModelController.$parsers.push(function(data) {
					//View -> Model
					var date = moment(data, 'YYYY-MM-DD', true);

					function isValid() {
						return date.diff(moment()) < 0;
					}

					ngModelController.$setValidity('date', isValid());

					return isValid() ? date.toDate() : undefined;
				});
				ngModelController.$formatters.push(function (data) {
					//Model -> View
					return $filter('date')(data, "yyyy-MM-dd");
				});
			}
    };
	}
})();
