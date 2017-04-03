import {curry, get, groupBy, head, sortBy, tail, take} from 'lodash'

export const Form = form()

function form() {
	const matches = curry(function(thing, other) {
		if (!thing || !other) return false
		if (typeof thing === 'object' && typeof other === 'object')
			return thing._id && other._id && thing._id === other._id
		return thing === other
	})

	var methods = {
		generate,
		selectAllFoods,
		isChecked,
		toggleCheckbox,
		setDependentList
	};

	return {methods};

	// Dynamically generate a form based on the questionnaire sections and fields
	// created in the questionnaire editor, and the list of foods in the db
	function generate(model, formData, qIdentifier) {
		const relevantSections = sortBy(
			formData.sections.filter(section => section.questionnaire.identifier === qIdentifier)
		, 'position');

		const dynForm = relevantSections.map(section => {
			const fields = formData.fields.filter(field => matches(field.section, section))

			const groupedRows = groupBy(fields, 'row')

			const rows = Object.keys(groupedRows)
				.map(rowNum => sortBy(groupedRows[rowNum], 'column'))

			return rows.map(row => {
				const firstCol = head(row)
				if (firstCol.type !== 'Table') return row
				return generateTableRow(model, firstCol.label, firstCol.name)
			})
		})

		return {
			dynForm,
			sectionNames: relevantSections.map(section => section.name),
			foodList: formData.foods
		};
	}

	// Helper function: generate table
	function generateTableRow(model, tableDescription, tableName) {
		const [rows, cols] = tail(/ROWS:\s*(.*)COLUMNS:\s*(.*)/.exec(tableDescription))
			.map(str => str.split(/;\s*/))

		const tableData = {
			rows,
			cols,
			columnNames: tail(cols)
		};

		const table = tableData.rows.map((row, i) => {
			let newRow = {name: row}

			tableData.columnNames.forEach(colName =>
				newRow[colName] = get(model, `${tableName}[${i}]${colName}`, 0))

			return newRow
		})

		return { table, tableHeaders: tableData.cols, tableName: tableName };
	}

	function selectAllFoods(model, checked) {
	// Toggle selection of all food items
		model.foodPreferences = []
		if (!checked)
			model.foodPreferences = model.foodList.map(item => item._id)
	}

	// True if model[field] contains item
	function isChecked(model, field, item) {
		const items = get(model, field, [])
		return !!items.find(matches(item))
	}

	// Toggle item in model[field]
	function toggleCheckbox(model, field, item) {
		const items = get(model, field, [])

		if (items.find(matches(item)))
			return items.filter(curr => !matches(curr)(item))

		return [...items, item]
	}

	function setDependentList(model, numDependents) {
		const dependents = [...model.household]
    const blankDependent = {
      name: '',
      relationship: '',
      dateOfBirth: ''
    }

    let newHousehold = take(dependents, numDependents)

    for (var i = dependents.length; i < numDependents; i++) {
      newHousehold.push(blankDependent)
    }

		return newHousehold
	}

} // Factory Form
