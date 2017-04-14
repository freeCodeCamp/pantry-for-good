import React from 'react'
import {
  Checkbox,
  ControlLabel,
  Glyphicon,
  HelpBlock,
  FormControl,
  FormGroup,
  Radio
} from 'react-bootstrap'

const FieldGroup = ({
  name,
  type,
  label,
  help,
  icon,
  valid,
  errorMessage,
  formGroupClass,
  required,
  children,
  ...props
}) => {
  let controlGroup

  if (type === 'checkbox') {
    controlGroup = <Checkbox name={name} type={type} {...props}>{label}</Checkbox>
  } else if (type === 'radio') {
    controlGroup = <Radio name={name} type={type} {...props}>{label}</Radio>
  } else {
    const component = (type === 'select' || type === 'textarea') && type

    controlGroup = (
      <div>
        {label &&
          <ControlLabel>
            {required ? `${label} *` : label}
          </ControlLabel>
        }

        {component ?
          <FormControl name={name} componentClass={component} {...props}>
            {children}
          </FormControl> :
          <FormControl name={name} type={type} {...props} />
        }

        {icon &&
          <FormControl.Feedback>
            <Glyphicon glyph={icon} />
          </FormControl.Feedback>
        }
        {errorMessage && <HelpBlock>{errorMessage}</HelpBlock>}
        {help && <HelpBlock>{help}</HelpBlock>}
      </div>
    )
  }

  if (props.inline) return controlGroup

  return (
    <FormGroup
      controlId={name}
      validationState={valid}
      className={formGroupClass}
    >
      {controlGroup}
    </FormGroup>
  )
}

export default FieldGroup
