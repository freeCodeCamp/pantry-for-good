import React from 'react'
import {compose, withHandlers, withPropsOnChange} from 'recompose'
import {ListGroupItem} from 'react-bootstrap'

import {Checkbox} from '../../../form'

const enhance = compose(
  withPropsOnChange(
    ['selectedItems'],
    ({item, selectedItems}) => ({
      selected: !!selectedItems.find(sel => sel._id === item._id)
    })
  ),
  withHandlers({
    handleItemsChange: ({item, selected, selectedItems, handleItemsChange}) =>
      () => selected ?
        handleItemsChange(selectedItems.filter(sel => sel._id !== item._id)) :
        handleItemsChange(selectedItems.concat(item))
  })
)

const FoodItem = ({item, selected, handleItemsChange}) =>
  <ListGroupItem
    className="foodItem"
    onClick={handleItemsChange}
  >
    <Checkbox
      style={{margin: '0 0 0 -20px'}}
      checked={selected}
      readOnly
    />
    <span>
      {item.name}
    </span>
  </ListGroupItem>

export default enhance(FoodItem)
