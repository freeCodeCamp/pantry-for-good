'use strict';

angular.module('customer').factory('Form', Form);

/* @ngInject */
function Form() {
	var service = {
		generate: generate,
		handleCheckboxClick: handleCheckboxClick,
	};

	return service;

	// Factory Implementation

	// Dynamically generates a questionnaire form based on the sections and fields
	// created in the questionnaire editor
	function generate(formObject, sectionsAndFields, qIdentifier) {
		var relevantSections = _.sortBy(_.filter(sectionsAndFields.sections, {'questionnaire': { 'identifier': qIdentifier }}), 'position');
		var maxColumns = 4, dynForm = [];

			// Loop through sections for given questionnaire
			for (var iSect = 0; iSect < relevantSections.length; iSect++) {
				var dynSection = [];
				var fieldsInSection = _.filter(sectionsAndFields.fields, { section: relevantSections[iSect] });
				var rowMaxInSection = _.maxBy(fieldsInSection, 'row') ? _.maxBy(fieldsInSection, 'row').row : 0;

				// Loop through rows for given section
				for (var iRow = 0; iRow < rowMaxInSection; iRow++) {
					var firstCell = _.find(fieldsInSection, { row: iRow + 1, column: 1 });

					// If the field at column 1 is a table, insert table row into dynamic form
					if (firstCell && firstCell.type === 'Table') {
						dynSection.push(generateTableRow(formObject, firstCell.label, firstCell.name));
					} else {

					// Otherwise, if the field at column 1 is not a table, insert standard row into dynamic form
						dynSection.push(generateStandardRow(iRow, fieldsInSection, maxColumns));
					}
				} // Next row
				dynForm.push(dynSection);
			} // Next section
			return dynForm;
	} // Function generate

	// Helper function: generate table
	function generateTableRow(formObject, tableDescription, tableName) {
		var tableRow = {
			rows: /(ROWS:\s*)(.*)(COLUMNS)/.exec(tableDescription)[2].split(/;\s*/),
			cols: /(COLUMNS:\s*)(.*)/.exec(tableDescription)[2].split(/;\s*/),
		};
		tableRow.inputFields = tableRow.cols.slice(1, 99);

		// If table does not exist on form object yet, add it
		if (!formObject[tableName]) {
			formObject[tableName] = [];
			tableRow.rows.forEach(function (item) {
				var cell = { name: item };
				for (var i = 0; i < tableRow.inputFields.length; i++) {
					cell[tableRow.inputFields[i]] = 0;
				}
				formObject[tableName].push(cell);
			});
		}

		return { tableHeaders: tableRow.cols, tableName: tableName };
	}

	// Helper function: generate standard row
	function generateStandardRow(iRow, fieldsInSection, maxColumns) {
		var cSkip = 0, standardRow = [];
		var emptyCell = { status: 'empty' }, skipCell = { status: 'skip' };

		// Loop through cells for given row
		for (var iColumn = 0; iColumn < maxColumns; iColumn++) {

			// If previous cell spans over current, skip
			if (cSkip > 0) {
				standardRow.push(skipCell);
				cSkip--;

			// Otherwise find field for given row and column
			} else {
				var field = _.find(fieldsInSection, { row: iRow + 1, column: iColumn + 1 });

				// If the field exists, insert it into row, otherwise insert empty placeholder cell into row
				standardRow.push(field ? field : emptyCell);
				cSkip = field ? field.span - 1 : 0;
			}
		} // Next column
		return standardRow;
	} // Helper function generate standard row

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
