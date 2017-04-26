import {curry, get, sortBy, tail, take} from 'lodash'
import {utc} from 'moment'

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
  }

  return {methods}

  // Dynamically generate a form based on the questionnaire fields
  function generate(model, questionnaire) {
    const form = questionnaire.sections.map(section => {
      const fields = sortBy(section.fields, 'row').map(row =>
        row.type === 'Table' ? generateTableRow(model, row) : row)

      return {
        ...section,
        fields
      }
    })

    return form
  }

  // Helper function: generate table
  function generateTableRow(model, tableRow) {
    const columnNames = tail(tableRow.columns)

    const table = tableRow.rows.map((row, i) => {
      let newRow = {name: row}

      columnNames.forEach(colName =>
        newRow[colName] = get(model, `${tableRow.label}[${i}]${colName}`, 0))

      return newRow
    })

    return { table, tableHeaders: tableRow.columns, tableName: tableRow.label }
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
