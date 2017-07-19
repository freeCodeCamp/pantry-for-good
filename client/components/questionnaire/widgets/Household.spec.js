import React from 'react'
import {shallow} from 'enzyme'

import {getFieldArrayMock} from '../../../lib/test-helpers'
import Household from './Household'
import HouseholdRow from './household/HouseholdRow'

describe('Household', function() {
  it('renders', function() {
    const fieldArrayMock = getFieldArrayMock([{}, {}])
    Household.__Rewire__('FieldArray', fieldArrayMock)

    const wrapper = shallow(<Household />)
    const householdRow = wrapper.find(fieldArrayMock).dive().dive().find(HouseholdRow)

    expect(wrapper.find(fieldArrayMock)).to.be.present()
    expect(householdRow).to.be.present().length(2)
  })

  it('adds fields', function() {
    const fieldArrayMock = getFieldArrayMock([{}])
    Household.__Rewire__('FieldArray', fieldArrayMock)

    const wrapper = shallow(<Household />)
    const renderHousehold = wrapper.find(fieldArrayMock).dive()
    const household = renderHousehold.dive()

    household.find('Button').simulate('click')

    expect(wrapper.find(fieldArrayMock)).to.be.present()
    expect(renderHousehold).to.have.prop('fields').length(2)
  })

  it('removes fields', function() {
    const fieldArrayMock = getFieldArrayMock([{}, {}])
    Household.__Rewire__('FieldArray', fieldArrayMock)

    const wrapper = shallow(<Household />)
    const renderHousehold = wrapper.find(fieldArrayMock).dive()
    const removeButton = renderHousehold.dive()
      .find(HouseholdRow)
      .first().dive()
      .find('Button')

    removeButton.simulate('click')

    expect(wrapper.find(fieldArrayMock)).to.be.present()
    expect(renderHousehold).to.have.prop('fields').length(1)
  })
})
