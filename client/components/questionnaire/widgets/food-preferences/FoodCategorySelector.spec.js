import React from 'react'
import {shallow} from 'enzyme'

import FoodCategorySelector from './FoodCategorySelector'

describe('FoodCategorySelector', function() {
  const categories = [
    {_id: 1, category: 'foo', items: [{_id: 1}, {_id: 2}]},
    {_id: 2, category: 'bar', items: [{_id: 3}, {_id: 4}]}
  ]

  it('renders', function() {
    const wrapper = shallow(
      <FoodCategorySelector
        foodCategories={categories}
        selectedItems={[]}
        handleItemsChange={() => {}}
        selectedCategoryId={categories[1]._id}
        handleCategorySelect={() => {}}
      />
    )

    expect(wrapper.children()).to.have.length(2)
    expect(wrapper.childAt(0)).to.have.prop('category', categories[0])
  })
})
