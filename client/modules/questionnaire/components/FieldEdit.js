import React from 'react'
import {
  Button,
  ButtonToolbar,
  Dropdown,
  Glyphicon,
  ListGroupItem,
  MenuItem,
  Row
} from 'react-bootstrap'

import {FieldGroup} from '../../../components/form'

const FieldEdit = ({field, description, onChange, onKeyUp}) =>
  <ListGroupItem onKeyUp={onKeyUp} style={{border: 'none'}}>
    <Row style={{display: 'flex', margin: '0'}}>
      <div style={{flexGrow: 10, margin: '0 10px 0 0'}}>
        <FieldGroup
          type="text"
          name="label"
          placeholder="Question Label"
          value={field.label}
          onChange={onChange(field._id)}
          autoFocus
        />
      </div>
      <ButtonToolbar>
        <Dropdown
          pullRight
          onSelect={mapEventKey(onChange(field._id))}
          id="fieldType"
        >
          <Dropdown.Toggle>
            {description}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem eventKey="text" active={field.type === 'text'}>Text</MenuItem>
            <MenuItem eventKey="address" active={field.type === 'address'}>Address</MenuItem>
            <MenuItem eventKey="textarea" active={field.type === 'textarea'}>Long Text</MenuItem>
            <MenuItem eventKey="date" active={field.type === 'date'}>Date</MenuItem>
            <MenuItem eventKey="radio" active={field.type === 'radio'}>Radio Buttons</MenuItem>
            <MenuItem eventKey="checkbox" active={field.type === 'checkbox'}>Checkbox</MenuItem>
            <MenuItem divider />
            <MenuItem header>Widgets</MenuItem>
            <MenuItem eventKey="foodPreferences" active={field.type === 'foodPreferences'}>Food Preferences</MenuItem>
            <MenuItem eventKey="household" active={field.type === 'household'}>Household</MenuItem>
            <MenuItem eventKey="table" active={field.type === 'table'}>Table</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        <Button name="moveUp" onClick={onChange(field._id)}>
          <Glyphicon glyph="arrow-up" />
        </Button>
        <Button name="moveDown" onClick={onChange(field._id)}>
          <Glyphicon glyph="arrow-down" />
        </Button>
      </ButtonToolbar>
    </Row>
  </ListGroupItem>

export default FieldEdit

function mapEventKey(cb) {
  return function(key) {
    cb({
      target: {
        name: 'type',
        value: key
      }
    })
  }
}
