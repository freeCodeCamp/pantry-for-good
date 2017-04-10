import React from 'react'
import {utc} from 'moment'

const ItemRow = ({
  item,
  model,
  showEdit,
  handleFieldChange,
  handleShowEdit,
  handleSave
}) =>
  showEdit ?
    <tr>
      <td><span>{item.name}</span></td>
      <td>
        <input
          className="form-control"
          type="week"
          value={utc(model.startDate).format('YYYY-[W]w')}
          onChange={handleFieldChange('startDate')}
          required
        />
      </td>
      <td>
        <input
          className="form-control"
          type="number"
          min="0"
          max="52"
          value={model.frequency}
          onChange={handleFieldChange('frequency')}
          required
        />
      </td>
      <td>
        <a
          onClick={handleSave}
          className="btn btn-success btn-flat btn-xs"
        >
          <i className="fa fa-download"></i> Save
        </a>
        <a
          onClick={handleShowEdit()}
          className="btn btn-primary btn-flat btn-xs"
        >
          <i className="fa fa-times"></i> Cancel
        </a>
      </td>
    </tr> :
    <tr>
      <td><span>{item.name}</span></td>
      <td>
        <span>{utc(item.startDate).format('YYYY-[W]w')}</span>
      </td>
      <td>
        <span>{item.frequency}</span>
      </td>
      <td>
        <a
          onClick={handleShowEdit(item)}
          className="btn btn-primary btn-flat btn-xs"
        >
          <i className="fa fa-pencil"></i> Edit
        </a>
      </td>
    </tr>

export default ItemRow
