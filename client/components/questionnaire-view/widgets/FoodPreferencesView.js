import React from 'react'
import PropTypes from 'prop-types'

const FoodPreferencesView = ({model}) =>
  <div style={{paddingBottom: '5px'}} className="questionnaireWidget">
    <div>
      <strong>Food Preferences:</strong>
    </div>
    {model.foodPreferences.map(food => food && food.name).join(', ')}
  </div>

FoodPreferencesView.propTypes = {
  model: PropTypes.shape({
    foodPreferences: PropTypes.array.isRequired
  }).isRequired
}

export default FoodPreferencesView
