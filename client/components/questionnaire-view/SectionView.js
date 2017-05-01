import React from 'react'
import {take, takeRight} from 'lodash'
import {utc} from 'moment'
import {Col, Row} from 'react-bootstrap'

import HouseholdView from './widgets/HouseholdView'
import FoodPreferencesView from './widgets/FoodPreferencesView'

const SectionView = ({section, model}) => {
  const fields = section.fields
  const numFields = fields.length

  if (!numFields) return null
  if (numFields === 1) return renderField(fields[0], model)

  const left = take(fields, Math.ceil(numFields / 2))
  const right = takeRight(fields, Math.floor(numFields / 2))

  return (
    <div>
      <Col xs={12} md={6}>
        {left.map(field => renderField(field, model))}
      </Col>
      <Col xs={12} md={6}>
        {right.map(field => renderField(field, model))}
      </Col>
    </div>
  )
}

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
      <Row key={field._id} style={{paddingBottom: '5px'}}>
        <Col xs={6}>
          <strong>{field.label}{': '}</strong>
          </Col>
        <Col xs={6} md={4} style={{textAlign: 'right'}}>
          {value}
        </Col>
      </Row>
    )
  }

  if (type === 'household')
    return <HouseholdView key={field._id} model={model} />

  if (type === 'foodPreferences')
    return <FoodPreferencesView key={field._id} model={model} />

  return null
}
