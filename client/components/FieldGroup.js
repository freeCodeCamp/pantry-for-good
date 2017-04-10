import React from 'react'
import {
  Checkbox,
  ControlLabel,
  HelpBlock,
  FormControl,
  FormGroup,
  Radio
} from 'react-bootstrap'

const FieldGroup = ({id, label, help, ...props}) => {
  let controlGroup

  if (props.type === 'checkbox') {
    controlGroup = <Checkbox {...props}>{label}</Checkbox>
  } else if (props.type === 'radio') {
    controlGroup = <Radio {...props}>{label}</Radio>
  } else {
    controlGroup = (
      <div>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </div>
    )
  }

  return (
    <FormGroup controlId={id}>
      {controlGroup}
    </FormGroup>
  )
}

export default FieldGroup
