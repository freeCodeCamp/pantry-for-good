import React from 'react'
import {values} from 'lodash'
import PropTypes from 'prop-types'

import {fieldTypes, widgetTypes} from '../../../common/constants'
import {RFFieldGroup} from '../form'
import FoodPreferences from './widgets/FoodPreferences'
import Household from './widgets/Household'

const Section = ({section}) =>
  <div style={{display: 'flex', flexWrap: 'wrap'}}>
    {section.fields.map(renderField)}
  </div>

Section.propTypes = {
  section: PropTypes.object.isRequired
}

export default Section

function renderField(field) {
  const type = field.type === fieldTypes.ADDRESS ? fieldTypes.TEXT : field.type
  const options = field.choices && field.choices.split(',')
    .map(choice => choice.trim())

  if (values(fieldTypes).find(t => t === type)) {
    return <RFFieldGroup
      key={field._id}
      name={`fields[${field._id}]`}
      label={field.label}
      type={type}
      required={field.required}
      options={options}
      formGroupClass="questionnaireInput"
      inline
    />
  }

  if (type === widgetTypes.HOUSEHOLD)
    return <Household key={field._id} className="questionnaireWidget" />

  if (type === widgetTypes.FOOD_PREFERENCES)
    return <FoodPreferences key={field._id} className="questionnaireWidget" />
}
