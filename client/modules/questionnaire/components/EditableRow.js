import React from 'react'
import {reduxForm} from 'redux-form'

import RowActions from './RowActions'
import {RFInput, RFSelect} from '../../../components/form'

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
          <RFSelect {...column} /> :
          <RFInput {...column} />
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
