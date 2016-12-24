'use strict';

angular.module('customer').factory('Form', Form);

/* @ngInject */
function Form() {
	var filteredSections;
	var service = {
		generate: generate,
		handleCheckboxClick: handleCheckboxClick,
	};

	return service;

	// Factory Implementation
	function generate(sectionsAndFields) {
		var cRows = _.maxBy(sectionsAndFields.fields, 'row').row, cCols = 4, cSkip = 0;
		var emptyCell = { status: 'empty' }, skipCell = { status: 'skip' };
		var dynamicForm = [];
		var r;

		// Limit to available sections of Client Questionnaire
		// TODO: Allow choice of questionnaire by passing identifier

		filteredSections = _.sortBy(_.filter(sectionsAndFields.sections, {'questionnaire': { 'identifier': 'qClients' }}), 'position');

		for (var s = 0; s < filteredSections.length; s++) {
			var tmpRow = [];
			for (var i = 0; i < cRows; i++) {
				var tmpArr = [];
				for (var j = 0; j < cCols; j++) {
					if (cSkip > 0) {
						tmpArr.push(skipCell);
						cSkip--;
					} else {
						r = _.find(sectionsAndFields.fields, {
							'row': i + 1,
							'column': j + 1,
							'section': filteredSections[s]
						});

						if (r === undefined) {
							tmpArr.push(emptyCell);
						} else {
							r.status = 'valid';
							tmpArr.push(r);
							cSkip = r.span - 1;
						} // if r is undefined
					} // if skip cells left

				} // for j, cells
				tmpRow.push(tmpArr);
			} // for i, rows
			dynamicForm.push(tmpRow);
		} // for s, sections

		return dynamicForm;
	} // Function generate

	function handleCheckboxClick(obj, name, element) {
		// Initialise as array if undefined
		if (typeof obj[name] !== 'object') {
			obj[name] = [element];
			return;
		}

		// If element is not yet in array, push it, otherwise delete it from array
		var i = obj[name].indexOf(element);
		if (i === -1) {
			obj[name].push(element);
		} else {
			obj[name].splice(i, 1);
		}
	} // Function handleCheckboxClick

} // Factory Form
