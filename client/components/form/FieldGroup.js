import React from 'react'
import {
  ControlLabel,
  Glyphicon,
  HelpBlock,
  FormControl,
  FormGroup,
  Radio
} from 'react-bootstrap'

import Checkbox from './Checkbox'

const FieldGroup = ({
  name,
  type,
  fieldType,
  label,
  help,
  icon,
  valid,
  touched,
  errorMessage,
  formGroupClass,
  style,
  required,
  ...props
}) =>
  <FormGroup
    controlId={name}
    validationState={valid}
    className={formGroupClass}
    style={style}
  >
    {label &&
      <ControlLabel>
        {required ? `${label} *` : label}
      </ControlLabel>
    }

    {renderField(type || fieldType, name, props)}

    {icon &&
      <FormControl.Feedback>
        <Glyphicon glyph={icon} />
      </FormControl.Feedback>
    }
    {(touched && errorMessage) && <HelpBlock>{errorMessage}</HelpBlock>}
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>

export default FieldGroup

function renderField(type, name, props) {
  const {options, inline, children, ...rest} = props

  if (type === 'checkbox') return renderCheckbox(name, options, inline, rest)
  if (type === 'radio') return renderRadio(name, options, inline, rest)

  if (type === 'select' || type === 'textarea') {
    return (
      <FormControl name={name} componentClass={type} {...rest}>
        {children}
      </FormControl>
    )
  }

  return (
    <FormControl name={name} type={type} {...rest} />
  )
}

function renderRadio(name, options, inline, props) {
  return (
    <div>
      {options.map((option, i) => {
        const value = option.value || option
        return (
          <Radio
            key={i}
            name={name}
            {...props}
            value={value}
            checked={value === props.value}
            inline={inline}
          >
            {option.label || option}
          </Radio>
        )
      })}
    </div>
  )
}

function renderCheckbox(name, options, inline, props) {
  return Array.isArray(options) ?
    <div>
      {options.map((option, i) =>
        <Checkbox
          key={i}
          name={name}
          {...props}
          value={option.value || option}
          onChange={() => props.onChange(option)}
          checked={isChecked(props.value, option)}
          inline={inline}
        >
          {option.label || option}
        </Checkbox>
      )}
    </div> :
    <Checkbox name={name} {...props}>
      {options}
    </Checkbox>
}

function isChecked(value, option) {
  if (!Array.isArray(value)) return false
  return typeof(value.find(val => val === option)) !== 'undefined'
}
