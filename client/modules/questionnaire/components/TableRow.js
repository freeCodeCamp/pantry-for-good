import React from 'react'

import RowActions from './RowActions'

const TableRow = ({
  model,
  columns,
  actions,
  onDelete,
  onEdit
}) =>
  <tr>
    {columns.map((column, i) =>
      <td key={i}>{typeof model[column.name] !== 'object' ? model[column.name] : model[column.name].name}</td>
    )}
    <RowActions
      actions={actions}
      handlers={{
        delete: onDelete(model),
        showEdit: onEdit(model)
      }}
    />
  </tr>

export default TableRow
