import React from 'react'
import P from 'prop-types'
import {compose, setPropTypes, withHandlers, withPropsOnChange} from 'recompose'
import {ListGroupItem} from 'react-bootstrap'

import {Checkbox} from '../../../form'

const enhance = compose(
  setPropTypes({
    selectedItems: P.array,
    item: P.object.isRequired,
    handleItemsChange: P.func.isRequired
  }),
  withPropsOnChange(
    ['selectedItems'],
    ({item, selectedItems}) => ({
      selected: !!selectedItems.find(sel => sel && sel._id === item._id)
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
      name={item._id}
      style={{margin: '0 0 0 -20px', cursor: 'pointer'}}
      checked={selected}
      readOnly
    />
    <span>
      {item.name}
    </span>
  </ListGroupItem>

export default enhance(FoodItem)
