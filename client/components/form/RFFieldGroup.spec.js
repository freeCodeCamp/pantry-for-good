import React from 'react'
import {shallow} from 'enzyme'

import {getMockField} from '../../lib/test-helpers'
import RFFieldGroup from './RFFieldGroup'

describe('RFFieldGroup', function() {
  beforeEach(function() {
    RFFieldGroup.__Rewire__('Field', getMockField())
  })

  afterEach(function() {
    RFFieldGroup.__ResetDependency__('Field')
  })

  it('renders radio buttons', function() {
    const wrapper = shallow(
      <RFFieldGroup name="foo" label="Foo" type="radio" />
    )

    const fieldGroup = wrapper.dive().dive()
    expect(fieldGroup).to.have.props({
      name: 'foo',
      label: 'Foo',
      fieldType: 'radio'
    })
  })

  it('renders a checkbox', function() {
    const wrapper = shallow(
      <RFFieldGroup name="foo" label="Foo" type="checkbox" />
    )

    const fieldGroup = wrapper.dive().dive()
    expect(fieldGroup).to.have.props({
      name: 'foo',
      label: 'Foo',
      type: 'checkbox'
    })
  })

  it('renders a checkbox group', function() {
    const options = [
      {name: 'foo', label: 'Foo'}
    ]
    const wrapper = shallow(
      <RFFieldGroup name="foo" label="Foo" type="checkbox" options={options} />
    )

    const fieldGroup = wrapper.dive().dive()
    expect(fieldGroup).to.have.props({
      name: 'foo',
      label: 'Foo',
      fieldType: 'checkbox'
    })
  })

  it('normalizeCheckboxValues', function() {
    const normalizeCheckboxValues = RFFieldGroup.__get__('normalizeCheckboxValues')

    const check1 = normalizeCheckboxValues('foo', [])
    const check2 = normalizeCheckboxValues('bar', check1)
    const check3 = normalizeCheckboxValues('foo', check2)

    expect(check1).to.eql(['foo'])
    expect(check2).to.eql(['foo', 'bar'])
    expect(check3).to.eql(['bar'])
  })

  it('renders a field group', function() {
    const wrapper = shallow(
      <RFFieldGroup name="foo" label="Foo" />
    )

    const fieldGroup = wrapper.dive().dive()
    expect(fieldGroup).to.have.props({
      name: 'foo',
      label: 'Foo'
    })
  })

  it('renders with warning', function() {
    RFFieldGroup.__Rewire__('Field', getMockField({meta: {
      touched: true,
      warning: 'warning'
    }}))

    const wrapper = shallow(
      <RFFieldGroup name="foo" label="Foo" />
    )

    const fieldGroup = wrapper.dive().dive()
    expect(fieldGroup).to.have.props({
      name: 'foo',
      label: 'Foo',
      valid: 'warning',
      errorMessage: 'warning',
      touched: true
    })
  })

  it('renders with error', function() {
    RFFieldGroup.__Rewire__('Field', getMockField({meta: {
      touched: true,
      error: 'error'
    }}))

    const wrapper = shallow(
      <RFFieldGroup name="foo" label="Foo" />
    )

    const fieldGroup = wrapper.dive().dive()
    expect(fieldGroup).to.have.props({
      name: 'foo',
      label: 'Foo',
      valid: 'error',
      errorMessage: 'error',
      touched: true
    })
  })
})
