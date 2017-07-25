import React from 'react'
import P from 'prop-types'
import {connect} from 'react-redux'
import {compose, setPropTypes, withPropsOnChange} from 'recompose'
import {ListGroup} from 'react-bootstrap'
import {get} from 'lodash'

import selectors from '../../../../store/selectors'
import FoodItem from './FoodItem'

const mapStateToProps = state => ({
  getFoodCategory: selectors.food.category.getOne(state)
})

const withItemsProp = withPropsOnChange(
  ['selectedCategoryId'],
  ({selectedCategoryId, getFoodCategory}) => ({
    items: get(getFoodCategory(selectedCategoryId), 'items')
  })
)

const enhance = compose(
  setPropTypes({
    items: P.array,
    selectedItems: P.array.isRequired,
    selectedCategoryId: P.any,
    handleItemsChange: P.func.isRequired
  }),
  connect(mapStateToProps),
  withItemsProp
)

const FoodItemSelector = ({
  items,
  selectedItems,
  handleItemsChange
}) =>
  <ListGroup style={{
    height: '225px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    alignItems: 'flex-start'
  }}>
    {items && items.map(item =>
      <FoodItem
        key={item._id}
        item={item}
        selectedItems={selectedItems}
        handleItemsChange={handleItemsChange}
        className="foodItem"
      />
    )}
  </ListGroup>

export default enhance(FoodItemSelector)
