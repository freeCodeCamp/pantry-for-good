import React from 'react'
import {shallow} from 'enzyme'

import FoodItem from './FoodItem'

describe('FoodItem', function() {
  const items = [{_id: 1, name: 'foo'}, {_id: 2, name: 'bar'}]

  it('renders', function() {
    const WrappedComponent = FoodItem.__get__('FoodItem')
    const wrapper = shallow(
      <WrappedComponent
        item={items[0]}
        selected={false}
        handleItemsChange={() => {}}
      />
    )

    expect(wrapper.childAt(0)).to.have.prop('checked', false)
    expect(wrapper.childAt(1)).to.have.text('foo')
  })

  it('renders checked', function() {
    const WrappedComponent = FoodItem.__get__('FoodItem')
    const wrapper = shallow(
      <WrappedComponent
        item={items[0]}
        selected={true}
        handleItemsChange={() => {}}
      />
    )

    expect(wrapper.childAt(0)).to.have.prop('checked', true)
    expect(wrapper.childAt(1)).to.have.text('foo')
  })

  it('enhancer adds selected prop', function() {
    const MockComponent = sinon.spy(() => null)
    const handleItemsChange = () => {}
    const enhancer = FoodItem.__get__('enhance')

    const Component = enhancer(MockComponent)
    const wrapper1 = shallow(
      <Component
        item={items[0]}
        selectedItems={[]}
        handleItemsChange={handleItemsChange}
      />
    )

    const wrapper2 = shallow(
      <Component
        item={items[0]}
        selectedItems={[items[0]]}
        handleItemsChange={handleItemsChange}
      />
    )

    wrapper1.dive()
    wrapper2.dive()

    expect(MockComponent.firstCall).to.have.been.calledWithMatch({selected: false})
    expect(MockComponent.secondCall).to.have.been.calledWithMatch({selected: true})
  })

  it('enhancer adds itemsChange handler', function() {
    const MockComponent = sinon.spy(
      ({handleItemsChange}) => <div onClick={handleItemsChange}></div>)
    const handleItemsChange = sinon.spy(() => {})
    const enhancer = FoodItem.__get__('enhance')

    const Component = enhancer(MockComponent)
    const wrapper1 = shallow(
      <Component
        item={items[0]}
        selectedItems={[]}
        handleItemsChange={handleItemsChange}
      />
    )

    const wrapper2 = shallow(
      <Component
        item={items[0]}
        selectedItems={[items[0]]}
        handleItemsChange={handleItemsChange}
      />
    )

    wrapper1.dive().simulate('click')
    wrapper2.dive().simulate('click')

    expect(handleItemsChange.firstCall).to.have.been.calledWithMatch([items[0]])
    expect(handleItemsChange.secondCall).to.have.been.calledWithMatch([])
  })
})
