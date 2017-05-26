import React from 'react'
import PropTypes from 'prop-types'

import {RFFieldGroup} from '../form'
import FoodPreferences from './widgets/FoodPreferences'
import Household from './widgets/Household'

const Section = ({section}) =>
  <div style={{display: 'flex', flexWrap: 'wrap'}}>
    {section.fields.map(renderField)}
  </div>

Section.propTypes = {
  section: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default Section

function renderField(field) {
  const inputTypes = ['text', 'textarea', 'date', 'checkbox', 'radio']
  const type = field.type === 'address' ? 'text' : field.type
  const options = field.choices && field.choices.split(',')
    .map(choice => choice.trim())

  if (inputTypes.find(t => t === type)) {
    return <RFFieldGroup
      key={field._id}
      name={`fields['${field._id}']`}
      label={field.label}
      type={type}
      required={field.required}
      options={options}
      formGroupClass="questionnaireInput"
      inline
    />
  }

  if (type === 'household')
    return <Household key={field._id} className="questionnaireWidget" />

  if (type === 'foodPreferences')
    return <FoodPreferences key={field._id} className="questionnaireWidget" />
}
