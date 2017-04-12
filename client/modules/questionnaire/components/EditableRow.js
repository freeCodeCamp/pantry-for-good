import React from 'react'
import head from 'lodash/head'

const EditableRow = ({
  model,
  editing,
  header,
  onFieldChange,
  onShowEdit,
  columns,
  actions
}) =>
  <tr>
    {columns.map((column, i) => {
      // the key to index into the model with
      const key = head(Object.keys(column))

      if (!editing && !header)
        return renderSpan(i, model[key])

      const fieldType = typeof column[key] === 'string' ?
        column[key] : head(Object.keys(column[key]))

      if (fieldType === 'select') {
        const selectOptions = column[key].select.options
        return renderSelect(i, model[key], selectOptions, onFieldChange(key))
      }

      const fieldOptions = column[key][fieldType]

      return (
        <td key={i}>
          <input
            className="form-control"
            type={fieldType}
            value={model[key] || ''}
            onChange={onFieldChange(key)}
            {...fieldOptions}
          />
        </td>
      )
    })}
    <td>
      {!editing && actions.map((action, i) =>
        <a
          key={i}
          onClick={action.onClick(model)}
          className={`btn btn-flat btn-xs btn-${action.buttonType}`}
        >
          {action.label}
        </a>
      )}
      {onShowEdit &&
        <a
          onClick={onShowEdit(editing ? null : model)}
          className="btn btn-flat btn-xs btn-primary"
        >
          {editing ? 'Cancel' : 'Edit'}
        </a>
      }
    </td>
  </tr>

export default EditableRow

function renderSelect(key, value, options, onChange) {
  return (
    <td key={key}>
      <select
        className="form-control"
        value={value}
        onChange={onChange}
      >
        {options && options.map((option, i) => {
          const {value, label} = option

          return (
            <option key={i} value={value || option}>
              {label || option}
            </option>
          )
        })}
      </select>
    </td>
  )
}

function renderSpan(key, value) {
  if (!value) return <td key={key}></td>

  return (
    <td key={key}>
      <span>
        {value._id ? value.name : value}
      </span>
    </td>
  )
}
