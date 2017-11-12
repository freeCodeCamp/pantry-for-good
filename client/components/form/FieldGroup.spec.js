import React from 'react'
import {shallow} from 'enzyme'
import {
  ControlLabel,
  FormControl,
  FormGroup,
  Glyphicon,
  HelpBlock,
  Radio
} from 'react-bootstrap'

import FieldGroup from './FieldGroup'
import Checkbox from './Checkbox'

describe('FieldGroup', function() {
  it('renders an input', function() {
    const wrapper = shallow(<FieldGroup name="foo" />)

    expect(wrapper.find(FormGroup)).to.be.present()
    expect(wrapper.find(FormGroup)).to.have.prop('controlId', 'foo')
    expect(wrapper.find(FormControl)).to.be.present()
    expect(wrapper.find(FormControl)).to.have.prop('name', 'foo')
  })

  it('renders a label', function() {
    const wrapper = shallow(<FieldGroup name="foo" label="Foo" />)

    expect(wrapper.find(ControlLabel).childAt(0)).to.have.text('Foo')
  })

  it('renders a required label', function() {
    const wrapper = shallow(<FieldGroup name="foo" label="Foo" required />)

    expect(wrapper.find(ControlLabel).childAt(0)).to.have.text('Foo *')
  })

  it('renders an icon', function() {
    const wrapper = shallow(<FieldGroup name="foo" icon="fooIcon" />)

    expect(wrapper.find(Glyphicon)).to.have.prop('glyph', 'fooIcon')
  })

  it('renders errors', function() {
    const wrapper = shallow(<FieldGroup name="foo" errorMessage="error" touched />)

    expect(wrapper.find(HelpBlock).childAt(0)).to.have.text('error')
  })

  it('renders errors only if touched', function() {
    const wrapper = shallow(<FieldGroup name="foo" errorMessage="error" />)

    expect(wrapper.find(HelpBlock)).to.not.be.present
  })

  it('renders a checkbox group', function() {
    const wrapper = shallow(
      <FieldGroup
        name="fooCheckboxes"
        type="checkbox"
        options={['foo']}
        inline
      />
    )

    const checkbox = wrapper.find(Checkbox).first()
    expect(checkbox).to.be.present
    expect(checkbox).to.have.props({
      value: 'foo',
      inline: true
    })
  })

  it('renders a checkbox group of string values', function() {
    const wrapper = shallow(
      <FieldGroup name="foo" type="checkbox" options={['foo', 'bar']} />
    )

    const checkboxes = wrapper.find(Checkbox)
    expect(checkboxes.first().childAt(0)).to.have.text('foo')
    expect(checkboxes.first()).to.have.prop('value', 'foo')
    expect(checkboxes.last().childAt(0)).to.have.text('bar')
    expect(checkboxes.last()).to.have.prop('value', 'bar')
  })

  it('renders a checkbox group of label, value pairs', function() {
    const options = [
      {label: 'Foo', value: 'foo'},
      {label: 'Bar', value: 'bar'}
    ]
    const wrapper = shallow(
      <FieldGroup
        name="foo"
        type="checkbox"
        options={options}
      />
    )

    const checkboxes = wrapper.find(Checkbox)

    expect(checkboxes.first().childAt(0)).to.have.text('Foo')
    expect(checkboxes.first()).to.have.prop('value', 'foo')
    expect(checkboxes.last().childAt(0)).to.have.text('Bar')
    expect(checkboxes.last()).to.have.prop('value', 'bar')
  })

  it('renders a radio group', function() {
    const wrapper = shallow(
      <FieldGroup
        name="fooRadios"
        type="radio"
        options={['foo', 'bar']}
        inline
      />
    )

    const radioButtons = wrapper.find(Radio)
    expect(radioButtons.first().childAt(0)).to.have.text('foo')
    expect(radioButtons.first()).to.have.props({
      value: 'foo',
      name: 'fooRadios',
      inline: true
    })
  })

  it('renders a select input', function() {
    const wrapper = shallow(
      <FieldGroup
        name="fooSelect"
        type="select"
      >
        <option value="foo">Foo</option>
        <option value="bar">Bar</option>
      </FieldGroup>
    )

    expect(wrapper.find(FormControl)).to.have.props({
      name: 'fooSelect',
      componentClass: 'select'
    })

    const options = wrapper.find('option')
    expect(options).to.have.length(2)
    expect(options.first().childAt(0)).to.have.text('Foo')
    expect(options.first()).to.have.prop('value', 'foo')
  })
})
