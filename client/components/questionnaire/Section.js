import React from 'react'
import {take, takeRight} from 'lodash'
import {Col} from 'react-bootstrap'

import {RFFieldGroup} from '../form'
import Household from './widgets/Household'

// eslint-disable-next-line no-unused-vars
const Section = ({section, model, onSubmit}) => {
  const fields = section.fields
  const numFields = fields.length

  const left = take(fields, Math.ceil(numFields / 2))
  const right = takeRight(fields, Math.floor(numFields / 2))

  return numFields > 1 ?
    <div>
      <Col xs={12} md={6}>
        {left.map(field =>
            renderField(field, model)
        )}
      </Col>
      <Col xs={12} md={6}>
        {right.map(field =>
            renderField(field, model)
        )}
      </Col>
    </div> :

    renderField(fields[0], model)
}

export default Section

function renderField(field, model) {
  const inputTypes = ['text', 'textarea', 'date', 'checkbox', 'radio']
  const type = field.type === 'address' ? 'text' : field.type
  const options = field.choices && field.choices.split(',')
    .map(choice => choice.trim())

  if (inputTypes.find(t => t === type)) {
    return <RFFieldGroup
      key={field._id}
      name={field._id}
      label={field.label}
      type={type}
      required={field.required}
      options={options}
      inline
    />
  }

  if (type === 'household')
    return <Household
      key={field._id}
      numberOfDependants={model.household.length}
      dependants={model.household}
      setDependantList={() => () => {}}
      handleFieldChange={() => () => {}}
    />
}
