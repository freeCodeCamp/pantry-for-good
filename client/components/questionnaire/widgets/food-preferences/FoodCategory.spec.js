import React from 'react'
import {shallow} from 'enzyme'

import FoodCategory from './FoodCategory'

describe('FoodCategory', function() {
  const categories = [
    {_id: 1, category: 'foo', items: [{_id: 1}, {_id: 2}]},
    {_id: 2, category: 'bar', items: [{_id: 3}, {_id: 4}]}
  ]

  it('renders', function() {
    const WrappedComponent = FoodCategory.__get__('FoodCategory')
    const wrapper = shallow(
      <WrappedComponent
        category={categories[0]}
        numSelected={0}
        partiallySelected={false}
        handleItemsChange={() => {}}
        selectedCategoryId={categories[1]._id}
        handleCategorySelect={() => {}}
      />
    )

    expect(wrapper).to.not.have.className('active')
    expect(wrapper.childAt(1)).to.have.text(categories[0].category)
    expect(wrapper.children().last()).to.have.text('0 / 2')
  })

  it('renders active', function() {
    const WrappedComponent = FoodCategory.__get__('FoodCategory')
    const wrapper = shallow(
      <WrappedComponent
        category={categories[0]}
        numSelected={0}
        partiallySelected={false}
        handleItemsChange={() => {}}
        selectedCategoryId={categories[0]._id}
        handleCategorySelect={() => {}}
      />
    )

    expect(wrapper).to.have.className('active')
  })

  it('renders partially selected', function() {
    const WrappedComponent = FoodCategory.__get__('FoodCategory')
    const wrapper = shallow(
      <WrappedComponent
        category={categories[0]}
        numSelected={1}
        partiallySelected={true}
        handleItemsChange={() => {}}
        selectedCategoryId={categories[0]._id}
        handleCategorySelect={() => {}}
      />
    )

    const checkbox = wrapper.childAt(0)
    expect(checkbox).to.have.className('partial')
    expect(checkbox).to.have.prop('checked', true)
  })

  it('click selects category', function() {
    const WrappedComponent = FoodCategory.__get__('FoodCategory')
    const categorySelectMock = sinon.spy()
    const wrapper = shallow(
      <WrappedComponent
        category={categories[0]}
        numSelected={1}
        partiallySelected={true}
        handleItemsChange={() => {}}
        selectedCategoryId={categories[0]._id}
        handleCategorySelect={categorySelectMock}
      />
    )

    wrapper.simulate('click')
    expect(categorySelectMock).to.have.been.calledWith(categories[0]._id)
  })

  it('checkbox click selects items', function() {
    const WrappedComponent = FoodCategory.__get__('FoodCategory')
    const itemsChangeMock = sinon.spy()
    const wrapper = shallow(
      <WrappedComponent
        category={categories[0]}
        numSelected={1}
        partiallySelected={true}
        handleItemsChange={itemsChangeMock}
        selectedCategoryId={categories[0]._id}
        handleCategorySelect={() => {}}
      />
    )

    wrapper.childAt(0).simulate('change')
    expect(itemsChangeMock).to.have.been.called
  })

  it('numItemsSelected', function() {
    const numItemsSelected = FoodCategory.__get__('numItemsSelected')
    const category = categories[0]
    const {items} = category
    const noneSelected = numItemsSelected(category, [])
    const oneSelected = numItemsSelected(category, [items[0]])
    const twoSelected = numItemsSelected(category, items)

    expect(noneSelected).to.equal(0)
    expect(oneSelected).to.equal(1)
    expect(twoSelected).to.equal(2)
  })

  it('enhancer adds numSelected and partiallySelected props', function() {
    const MockComponent = sinon.spy(() => null)
    const enhance = FoodCategory.__get__('enhance')

    const Component = enhance(MockComponent)

    const category = categories[0]
    const wrapper1 = shallow(
      <Component
        category={category}
        selectedItems={[]}
        handleItemsChange={() => {}}
        handleCategorySelect={() => {}}
      />
    )

    const wrapper2 = shallow(
      <Component
        category={category}
        selectedItems={[category.items[0]]}
        handleItemsChange={() => {}}
        handleCategorySelect={() => {}}
      />
    )

    const wrapper3 = shallow(
      <Component
        category={category}
        selectedItems={category.items}
        handleItemsChange={() => {}}
        handleCategorySelect={() => {}}
      />
    )

    expect(wrapper1).to.have.props({numSelected: 0, partiallySelected: false})
    expect(wrapper2).to.have.props({numSelected: 1, partiallySelected: true})
    expect(wrapper3).to.have.props({numSelected: 2, partiallySelected: false})
  })

  it('enhancer adds itemsChange handler', function() {
    const MockComponent = sinon.spy(
      ({handleItemsChange}) => <div onClick={handleItemsChange}></div>)
    const handleItemsChangeMock = sinon.spy(() => {})
    const enhance = FoodCategory.__get__('enhance')

    const Component = enhance(MockComponent)

    const category = categories[0]
    const wrapper1 = shallow(
      <Component
        category={category}
        selectedItems={[]}
        handleItemsChange={handleItemsChangeMock}
        handleCategorySelect={() => {}}
      />
    )

    const wrapper2 = shallow(
      <Component
        category={category}
        selectedItems={[category.items[0]]}
        handleItemsChange={handleItemsChangeMock}
        handleCategorySelect={() => {}}
      />
    )

    const wrapper3 = shallow(
      <Component
        category={category}
        selectedItems={category.items}
        handleItemsChange={handleItemsChangeMock}
        handleCategorySelect={() => {}}
      />
    )

    wrapper1.dive().simulate('click')
    wrapper2.dive().simulate('click')
    wrapper3.dive().simulate('click')

    expect(handleItemsChangeMock.firstCall).to.have.been.calledWith(category.items)
    expect(handleItemsChangeMock.secondCall).to.have.been.calledWith(category.items)
    expect(handleItemsChangeMock.thirdCall).to.have.been.calledWith([])
  })
})
