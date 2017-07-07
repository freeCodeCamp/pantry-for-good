import React from 'react'
import {withHandlers} from 'recompose'
import {FieldArray} from 'redux-form'
import {Button} from 'react-bootstrap'

import DonationItemRow from './DonationItemRow'

const renderItems = withHandlers({
  handleAdd: ({fields}) => () => fields.push(),
  handleDelete: ({fields}) => index => () => fields.remove(index)
})(({fields, handleAdd, handleDelete}) =>
  <div>
    <ul style={{padding: 0}}>
      {fields.map((item, i) =>
        <DonationItemRow
          key={i}
          item={item}
          showDelete={fields.length > 1}
          handleDelete={handleDelete(i)}
        />
      )}
    </ul>
    <div className="text-center">
      <Button onClick={handleAdd}>Add Item</Button>
    </div>
  </div>
)

const DonationItems = () =>
  <FieldArray
    name="items"
    component={renderItems}
  />

export default DonationItems
