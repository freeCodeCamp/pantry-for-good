import React from 'react'
import {Field} from 'redux-form'

const Input = ({name, type, ...props}) => {
  const component = type === 'textarea' ? 'textarea' : 'input'
  return (
    <Field
      name={name}
      type={type}
      component={component}
      className="form-control"
      {...props}
    />
  )
}

export default Input
