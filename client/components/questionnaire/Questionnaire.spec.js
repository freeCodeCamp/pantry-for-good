import React from 'react'
import {shallow} from 'enzyme'

import {widgetTypes} from '../../../common/constants'
import Questionnaire from './Questionnaire'

describe('Questionnaire', function() {
  it('renders', function() {
    const questionnaire = {
      _id: 1,
      sections: [
        {_id: 1, name: 'foo', fields: [{}]},
        {_id: 2, name: 'bar', fields: [{}]},
      ]
    }
    const Component = Questionnaire.__get__('Questionnaire')
    const wrapper = shallow(
      <Component questionnaire={questionnaire} initialValues={{}}/>)
    const sections = wrapper.find('Section')

    expect(sections).to.have.length(2)
    expect(sections.first()).to.have.prop('section', questionnaire.sections[0])
  })

  it('validateHousehold', function() {
    const invalid = {
      household: [
        {name: 'foo', relationship: '', dateOfBirth: '1980-07-08'},
        {name: '', relationship: '', dateOfBirth: ''}
      ]
    }
    const valid = {
      household: [{name: 'foo', relationship: 'bar', dateOfBirth: '1980-07-08'}]
    }

    const fields = [{type: widgetTypes.HOUSEHOLD}]

    const validateHousehold = Questionnaire.__get__('validateHousehold')
    const noResult = validateHousehold(valid, [])
    const invalidResult = validateHousehold(invalid, fields)
    const validResult = validateHousehold(valid, fields)

    expect(noResult).to.be.a('undefined')
    expect(validResult).to.eql([{}])
    expect(invalidResult).to.be.an('array').length(2)
    expect(invalidResult[0]).to.have.property('relationship').is.a('string')
    expect(invalidResult[1])
  })

  it('validateQuestionnaireFields', function() {
    const validateMock = sinon.stub()
      .onFirstCall().returns({1: 'required'})
      .onSecondCall().returns({2: 'wrong'})

    const fields = [{_id: '1'}, {_id: '2'}]
    const values = {fields: {1: {value: ''}, 2: {value: 'bar'}}}

    const validateQuestionnaireFields = Questionnaire.__get__('validateQuestionnaireFields')

    Questionnaire.__Rewire__('validate', validateMock)
    const result = validateQuestionnaireFields(values, fields)
    Questionnaire.__ResetDependency__('validate')

    expect(validateMock).to.have.been.calledTwice
    expect(validateMock.firstCall).to.have.been
      .calledWith({value: ''}, {_id: '1'})
    expect(result).to.eql({
      1: 'required',
      2: 'wrong'
    })
  })
})
