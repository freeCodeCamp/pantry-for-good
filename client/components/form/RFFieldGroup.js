import React from 'react'
import {Field} from 'redux-form'

import FieldGroup from './FieldGroup'

const RFFieldGroup = ({type, ...props}) => {
  if (type === 'radio') {
    // Field wraps multiple inputs, have to avoid setting its 'type' prop
    return <Field component={renderFieldGroup} fieldType={type} {...props} />
  }

  if (type === 'checkbox') {
    return Array.isArray(props.options) ?
      <Field
        component={renderFieldGroup}
        fieldType={type}
        normalize={normalizeCheckboxValues}
        {...props}
      /> :
      <Field
        component={renderFieldGroup}
        type={type}
        {...props}
      />
  }

  return <Field component={renderFieldGroup} type={type} {...props} />
}

export default RFFieldGroup

function renderFieldGroup({input, meta, ...props}) {
  return (
    <FieldGroup
      valid={validationState({meta})}
      errorMessage={meta.error || meta.warning}
      touched={meta.touched}
      {...input}
      {...props}
    />
  )
}

function normalizeCheckboxValues(value, previousValue) {
  // only the onChange event returns a string
  if (typeof value !== 'string' || !value.length) return previousValue
  if (!previousValue || !previousValue.length) return [value]
  if (!previousValue.find(val => val === value))
    return [...previousValue, value]
  return previousValue.filter(val => val !== value)
}

function validationState({meta: {touched, error, warning}}) {
  if (!touched) return
  if (error) return 'error'
  if (warning) return 'warning'
}
