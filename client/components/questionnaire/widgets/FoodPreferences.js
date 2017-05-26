import React from 'react'
import {Field} from 'redux-form'

import FoodSelector from './food-preferences/FoodSelector'

const FoodPreferences = ({className}) =>
  <div className={className}>
    <Field
      name="foodPreferences"
      component={renderFoodPreferences}
    />
  </div>

export default FoodPreferences

function renderFoodPreferences({input}) {
  return (
    <div>
      <label>Please select the foods you are interested in</label>
      <FoodSelector
        selectedItems={input.value}
        handleItemsChange={input.onChange}
      />
    </div>
  )
}
