import React from 'react'
import {shallow} from 'enzyme'

import FoodSelector from './FoodSelector'
import FoodCategorySelector from './FoodCategorySelector'
import FoodItemSelector from './FoodItemSelector'

describe('FoodSelector', function() {
  const categories = [
    {_id: 1, items: [{_id: 1}, {_id: 2}]},
    {_id: 2, items: [{_id: 3}, {_id: 4}]}
  ]

  it('renders', function() {
    const WrappedComponent = FoodSelector.__get__('FoodSelector')
    const wrapper = shallow(
      <WrappedComponent
        foodCategories={categories}
        selectedItems={[]}
        handleItemsChange={() => {}}
        selectedCategoryId={1}
        handleCategorySelect={() => {}}
      />
    )

    expect(wrapper.find(FoodCategorySelector)).to.be.present()
    expect(wrapper.find(FoodItemSelector)).to.be.present()
  })

  it('enhancer adds category select handler', function() {
    const MockComponent = sinon.spy(
      ({handleCategorySelect}) => <div onClick={handleCategorySelect(1)}></div>)
    const selectCategory = sinon.spy()
    const enhancer = FoodSelector.__get__('withCategorySelectHandler')

    const Component = enhancer(MockComponent)
    const wrapper = shallow(
      <Component selectCategory={selectCategory} />)

    wrapper.simulate('click')

    expect(selectCategory).to.have.been.calledWith(1)
  })
})
