import React from 'react'
import {Field} from 'redux-form'

const Input = ({name, options, ...props}) => {
  return (
    <Field
      name={name}
      component="select"
      className="form-control"
      {...props}
    >
      {props.placeholder && <option value="">{props.placeholder}</option>}
      {options && options.map((option, i) =>
        typeof option === 'string' ?
          <option key={i} value={option}>{option}</option> :
          <option key={i} value={option.value}>{option.label}</option>
      )}
    </Field>
  )
}

export default Input
