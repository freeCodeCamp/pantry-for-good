import React from 'react'
import {Field, reduxForm} from 'redux-form'

import RowActions from './RowActions'

const EditableRow = ({
  columns,
  actions,
  handleSubmit,
  onSubmit,
  reset,
  onEdit
}) =>
  <tr>
    {columns.map((column, i) =>
      <td key={i}>
        {column.type === 'select' ?
          <Select column={column} /> :
          <Input column={column} />
        }
      </td>
    )}
    <RowActions
      actions={actions}
      handlers={{
        save: handleSubmit,
        hideEdit: onEdit && onEdit(),
        reset
      }}
    />
  </tr>

export default reduxForm()(EditableRow)

function Input({column}) {
  const component = column.type === 'textarea' ? 'textarea' : 'input'
  return (
    <Field
      name={column.name}
      type={column.type}
      placeholder={column.placeholder}
      component={component}
      className="form-control"
    />
  )
}

function Select({column}) {
  return (
    <Field
      name={column.name}
      component="select"
      className="form-control"
    >
      {column.options && column.options.map((option, i) =>
        <option key={i} value={option.value}>{option.label}</option>
      )}
    </Field>
  )
}
