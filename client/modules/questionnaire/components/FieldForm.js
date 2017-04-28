import React from 'react'
import {capitalize} from 'lodash'
import {ListGroup} from 'react-bootstrap'

import FieldEdit from './FieldEdit'
import FieldView from './FieldView'

const FieldForm = ({fields, selectedField, onSelect, onChange, onKeyUp}) =>
  <div>
    <h4>Questions</h4>
    <ListGroup>
      {fields.map((field, i) =>
        field.position === selectedField ?
          <FieldEdit
            key={i}
            field={field}
            onChange={onChange}
            onKeyUp={onKeyUp}
            description={mapTypeToDescription(field.type)}
          /> :
          <FieldView
            key={i}
            field={field}
            onSelect={onSelect}
            description={mapTypeToDescription(field.type)}
          />
      )}
    </ListGroup>
  </div>

export default FieldForm

function mapTypeToDescription(type) {
  switch (type) {
    case 'textarea': return 'Long Text'
    case 'radio': return 'Radio Buttons'
    case 'checkbox': return 'Checkboxes'
    case 'foodPreferences': return 'Food Preferences'
    default: return capitalize(type)
  }
}
