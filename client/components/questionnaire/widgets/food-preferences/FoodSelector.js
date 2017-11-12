import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {compose, setPropTypes, withHandlers, withState} from 'recompose'
import {get} from 'lodash'

import selectors from '../../../../store/selectors'
import FoodCategorySelector from './FoodCategorySelector'
import FoodItemSelector from './FoodItemSelector'

const withCategorySelectHandler = withHandlers({
  handleCategorySelect: ({selectCategory}) => categoryId => () =>
    selectCategory(categoryId)
})

const enhance = compose(
  setPropTypes({
    selectedItems: PropTypes.array.isRequired,
    handleItemsChange: PropTypes.func.isRequired
  }),
  connect(state => ({
    foodCategories: selectors.food.category.getAll(state)
  })),
  withState('selectedCategoryId', 'selectCategory', ({foodCategories}) =>
    get(foodCategories, '[0]._id')),
  withCategorySelectHandler
)

const FoodSelector = ({
  foodCategories,
  selectedItems,
  handleItemsChange,
  selectedCategoryId,
  handleCategorySelect
}) =>
  <div style={{display: 'flex', margin: '10px 0'}}>
    <div className="foodCategoryContainer">
      <label>Categories:</label>
      <FoodCategorySelector
        foodCategories={foodCategories}
        selectedItems={selectedItems}
        handleItemsChange={handleItemsChange}
        selectedCategoryId={selectedCategoryId}
        handleCategorySelect={handleCategorySelect}
      />
    </div>
    <div className="foodItemContainer">
      <label>Items:</label>
      <FoodItemSelector
        selectedItems={selectedItems}
        handleItemsChange={handleItemsChange}
        selectedCategoryId={selectedCategoryId}
      />
    </div>
  </div>

FoodSelector.propTypes = {
  foodCategories: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  handleItemsChange: PropTypes.func.isRequired,
  selectedCategoryId: PropTypes.string,
  handleCategorySelect: PropTypes.func.isRequired
}

export default enhance(FoodSelector)
