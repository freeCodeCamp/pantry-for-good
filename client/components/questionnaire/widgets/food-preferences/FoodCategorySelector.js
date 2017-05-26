import React from 'react'
import {ListGroup} from 'react-bootstrap'

import FoodCategory from './FoodCategory'

const FoodCategorySelector = ({
  foodCategories,
  selectedItems,
  handleItemsChange,
  selectedCategoryId,
  handleCategorySelect
}) =>
  <ListGroup style={{height: '225px', overflowY: 'auto'}}>
    {foodCategories.map(category =>
      <FoodCategory
        key={category._id}
        category={category}
        selectedItems={selectedItems}
        handleItemsChange={handleItemsChange}
        selectedCategoryId={selectedCategoryId}
        handleCategorySelect={handleCategorySelect}
      />
    )}
  </ListGroup>

export default FoodCategorySelector
