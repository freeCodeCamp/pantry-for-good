import React from 'react'
import {shallow} from 'enzyme'

import {fieldTypes, widgetTypes} from '../../../common/constants'
import Section from './Section'

describe('Section', function() {
  it('renders', function() {
    const renderFieldMock = sinon.spy()
    const section = {
      fields: [{_id: 1}, {_id: 2}]
    }

    Section.__Rewire__('renderField', renderFieldMock)
    shallow(<Section section={section} />)
    Section.__ResetDependency__('renderField')

    expect(renderFieldMock).to.have.been.calledTwice
    expect(renderFieldMock.firstCall).to.have.been.calledWith(section.fields[0])
  })

  it('renderField renders field types', function() {
    const renderField = Section.__get__('renderField')
    const field = {
      _id: 1,
      type: fieldTypes.TEXT,
      label: 'Foo',
      required: true
    }

    const wrapper = shallow(renderField(field))

    expect(wrapper).to.have.props({
      type: fieldTypes.TEXT,
      label: 'Foo',
      required: true
    })
  })

  it('renderField renders widget types', function() {
    const renderField = Section.__get__('renderField')
    const field = {
      _id: 1,
      type: widgetTypes.FOOD_PREFERENCES,
    }

    const wrapper = shallow(renderField(field))

    expect(wrapper).to.have.props({
      className: 'questionnaireWidget'
    })
  })
})
