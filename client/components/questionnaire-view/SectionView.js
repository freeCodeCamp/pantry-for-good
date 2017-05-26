import React from 'react'
import {utc} from 'moment'

import HouseholdView from './widgets/HouseholdView'
import FoodPreferencesView from './widgets/FoodPreferencesView'

const SectionView = ({section, model}) =>
  <div style={{display: 'flex', flexWrap: 'wrap'}}>
    {section.fields.map(field => renderField(field, model))}
  </div>

export default SectionView

function renderField(field, model) {
  const textTypes = ['text', 'textarea', 'date', 'checkbox', 'radio']
  const type = field.type === 'address' ? 'text' : field.type

  if (textTypes.find(t => t === type)) {
    const modelField = model.fields.find(f => f.meta._id === field._id)
    const value = type === 'date' ?
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

  if (type === 'household')
    return <HouseholdView key={field._id} model={model} className="questionnaireWidget" />

  if (type === 'foodPreferences')
    return <FoodPreferencesView key={field._id} model={model} />

  return null
}
