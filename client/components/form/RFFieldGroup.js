import React from 'react'
import {Field} from 'redux-form'
import FieldGroup from './FieldGroup'

const RFFieldGroup = ({...props}) =>
  <Field component={renderFieldGroup} {...props} />

export default RFFieldGroup

function renderFieldGroup({input, meta, ...props}) {
  return (
    <FieldGroup
      valid={validationState({meta})}
      errorMessage={meta.error}
      {...input}
      {...props}
    />
  )
}

function validationState({meta: {touched, error}}) {
  if (!touched) return
  if (touched && !error) return 'success'
  return 'error'
}
