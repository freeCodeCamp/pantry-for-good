import React from 'react'
import PropTypes from 'prop-types'
import {values} from 'lodash'
import {utc} from 'moment'

import {fieldTypes, widgetTypes} from '../../../common/constants'
import HouseholdView from './widgets/HouseholdView'
import FoodPreferencesView from './widgets/FoodPreferencesView'

const SectionView = ({section, model}) =>
  <div style={{display: 'flex', flexWrap: 'wrap'}}>
    {section.fields.map(field => renderField(field, model))}
  </div>

SectionView.propTypes = {
  model: PropTypes.shape({
    fields: PropTypes.array.isRequired
  }).isRequired,
  section: PropTypes.shape({
    fields: PropTypes.array.isRequired
  }).isRequired
}

export default SectionView

function renderField(field, model) {
  const type = field.type === fieldTypes.ADDRESS ? fieldTypes.TEXT : field.type

  if (values(fieldTypes).find(t => t === type)) {
    const modelField = model.fields.find(f => f.meta._id === field._id)
    const value = type === fieldTypes.DATE ?
      modelField && modelField.value && utc(modelField.value).format('YYYY-MM-DD') :
      modelField && modelField.value || ''

    return (
      <div
        key={field._id}
        className="questionnaireInput"
        style={{display: 'flex', flexWrap: 'nowrap'}}
      >
        <strong style={{maxWidth: '50%', flexGrow: 1}}>
          {field.label}{': '}
        </strong>
        <span style={{alignItems: 'flex-end'}}>
          {value}
        </span>
      </div>
    )
  }

  if (type === widgetTypes.HOUSEHOLD)
    return <HouseholdView key={field._id} model={model} className="questionnaireWidget" />

  if (type === widgetTypes.FOOD_PREFERENCES)
    return <FoodPreferencesView key={field._id} model={model} />

  return null
}
