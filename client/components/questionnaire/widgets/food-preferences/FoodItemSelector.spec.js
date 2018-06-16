import React from 'react'
import Enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'

import FoodItemSelector from './FoodItemSelector'

Enzyme.configure({adapter: new Adapter()})

describe('FoodItemSelector', function() {
  const items = [{_id: 1, name: 'foo'}, {_id: 2, name: 'bar'}]

  it('renders', function() {
    const WrappedComponent = FoodItemSelector.__get__('FoodItemSelector')
    const wrapper = shallow(
      <WrappedComponent
        items={items}
        selectedItems={[]}
        handleItemsChange={() => {}}
      />
    )

    expect(wrapper.children()).to.have.length(2)
    expect(wrapper.childAt(0)).to.have.prop('item', items[0])
  })

  it('enhancer adds items prop', function() {
    const MockComponent = sinon.spy(() => null)
    const category = {_id: 1, items}
    const getFoodCategory = sinon.stub().returns(category)
    const enhancer = FoodItemSelector.__get__('withItemsProp')

    const Component = enhancer(MockComponent)
    shallow(
      <Component
        selectedCategoryId={1}
        getFoodCategory={getFoodCategory}
      />
    )

    expect(getFoodCategory).to.have.been.calledWith(1)
    expect(MockComponent).to.have.been.calledWithMatch({items})
  })
})
