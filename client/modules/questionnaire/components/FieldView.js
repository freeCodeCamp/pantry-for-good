import React from 'react'
import {ListGroupItem} from 'react-bootstrap'

const FieldView = ({field, description, onSelect}) =>
  <ListGroupItem
    header={field.label}
    onClick={() => onSelect(field.position)}
    style={{border: 'none'}}
  >
    {description}
  </ListGroupItem>

export default FieldView
