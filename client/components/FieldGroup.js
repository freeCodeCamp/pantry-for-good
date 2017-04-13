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
  label,
  help,
  icon,
  valid,
  formGroupClass,
  ...props
}) => {
  let controlGroup

  if (props.type === 'checkbox') {
    controlGroup = <Checkbox name={name} {...props}>{label}</Checkbox>
  } else if (props.type === 'radio') {
    controlGroup = <Radio name={name} {...props}>{label}</Radio>
  } else {
    controlGroup = (
      <div>
        {label && <ControlLabel>{label}</ControlLabel>}
        <FormControl name={name} {...props} />
        {icon &&
          <FormControl.Feedback>
            <Glyphicon glyph={icon} />
          </FormControl.Feedback>
        }
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
