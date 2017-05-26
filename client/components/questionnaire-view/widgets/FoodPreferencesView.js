import React from 'react'

const FoodPreferencesView = ({model}) =>
  <div style={{paddingBottom: '5px'}} className="questionnaireWidget">
    <div>
      <strong>Food Preferences:</strong>
    </div>
    {model.foodPreferences.map(food => food && food.name).join(', ')}
  </div>

export default FoodPreferencesView
