'use strict';

angular.module('core').factory('Form', Form);

/* @ngInject */
function Form() {
	var service = {
		generate: generate,
		getSectionNames: getSectionNames,
		handleCheckboxClick: handleCheckboxClick,
	};

	return service;

	// Factory Implementation

	// Dynamically generates a questionnaire form based on the sections and fields
	// created in the questionnaire editor
	function generate(formObject, sectionsAndFields, qIdentifier) {
		var relevantSections = _.sortBy(_.filter(sectionsAndFields.sections, function(obj) {
			// TODO: REMOVE LIMIT ON POSITION ONCE FIELDS FOR SECTIONS C AND E HAVE BEEN IMPLEMENTED
			return (obj.questionnaire.identifier === qIdentifier && obj.position < 10);
		}), 'position');
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
		var parsedTableDescription = {
			rows: /(ROWS:\s*)(.*)(COLUMNS)/.exec(tableDescription)[2].split(/;\s*/),
			cols: /(COLUMNS:\s*)(.*)/.exec(tableDescription)[2].split(/;\s*/),
		};
		parsedTableDescription.columnNames = parsedTableDescription.cols.slice(1, 99);

		// Initialize table array to be used for initialization
		var tmpTable = [];

		// Go through each table row and initialize keys that don't exist yet
		for (var iTableRow = 0; iTableRow < parsedTableDescription.rows.length; iTableRow++) {
			// Create row object with name from description
			tmpTable.push({ name: parsedTableDescription.rows[iTableRow] });

			// Initialize values in table row that don't exist yet
			for (var iCell = 0; iCell < parsedTableDescription.columnNames.length; iCell++) {
				var iTableColumn = parsedTableDescription.columnNames[iCell];

				// Take value from table on form object, if they exist
				try {
					tmpTable[iTableRow][iTableColumn] = formObject[tableName][iTableRow][iTableColumn] || 0;
				} catch (e) {
					tmpTable[iTableRow][iTableColumn] = 0;
				}

			} // next value
		} // next table row

		formObject[tableName] = tmpTable;
		return { tableHeaders: parsedTableDescription.cols, tableName: tableName };
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

	
	function getSectionNames(sectionsAndFields, qIdentifier) {
		return _.map(_.sortBy(_.filter(sectionsAndFields.sections, {'questionnaire': { 'identifier': qIdentifier }}), 'position'), 'name');
	}


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
