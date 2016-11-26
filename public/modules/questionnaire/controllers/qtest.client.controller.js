/* globals _ */

(function() {
	'use strict';

	angular.module('questionnaire').controller('qTestController', qTestController);

	/* @ngInject */
	function qTestController(Questionnaire, Section, Field, $scope) {


		$scope.form = {}; // Object to put input field on

		$scope.nest = function (seq, keys) {
			if (!keys.length)
					return seq;
			var first = keys[0];
			var rest = keys.slice(1);
			return _.mapValues(_.groupBy(seq, first), function (value) {
					return $scope.nest(value, rest);
			});
		};

		$scope.selectedQuestionnaire = '58274c48d3a1ae2d27071be3';
		$scope.handleSelection = function () {
		  $scope.rows = _.toPairs($scope.nest(_.filter($scope.fields,
				{ section: { questionnaire: { _id: $scope.selectedQuestionnaire }}}),
				['row', 'column']));
		};

	// Load all questionnaires
		Questionnaire.query({}, function (questionnaires) {
			$scope.questionnaires = questionnaires;
		});

	// Load all sections
		Section.query({}, function (sections) {
			$scope.sections = sections;
		});

	// Load all fields
		Field.query({}, function (fields) {
			$scope.fields = fields;
		});

	}
})();
