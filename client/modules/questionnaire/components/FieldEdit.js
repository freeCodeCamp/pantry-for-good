import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import {reduxForm, formValueSelector} from 'redux-form'
import {ButtonToolbar, Button, ListGroupItem} from 'react-bootstrap'

import {
  fieldTypes,
  widgetTypes,
  questionnaireIdentifiers
} from '../../../../common/constants'
import selectors from '../../../store/selectors'
import {RFFieldGroup} from '../../../components/form'

const selector = formValueSelector('fieldForm')
const mapStateToProps = state => ({
  fieldType: selector(state, 'type'),
  questionnaire: selectors.qEditor.getEditingQuestionnaire(state)
})

const FieldEdit = ({
  handleSubmit,
  onEdit,
  onDelete,
  onKeyUp,
  fieldType,
  questionnaire
}) =>
  <ListGroupItem
    onKeyUp={onKeyUp}
    style={{border: 'none'}}
  >
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      <div style={{display: 'flex', flexGrow: 1, flexBasis: '100%'}}>
        <RFFieldGroup
          type="text"
          name="label"
          placeholder="Question Label"
          required
          autoFocus
          style={{flexGrow: 1, paddingRight: '10px'}}
        />
        <RFFieldGroup
          type="select"
          name="type"
        >
          <optgroup label="Inputs">
            <option value="text">Text</option>
            <option value="address">Address</option>
            <option value="textarea">Long Text</option>
            <option value="date">Date</option>
            <option value="radio">Radio Buttons</option>
            <option value="checkbox">Checkboxes</option>
          </optgroup>
          <optgroup label="Widgets">
            {/*TODO*/}
            {/*<option value="table">Table</option>*/}
            {questionnaire.identifier === questionnaireIdentifiers.CUSTOMER &&
              <option value="foodPreferences">Food Preferences</option>
            }
            {questionnaire.identifier === questionnaireIdentifiers.CUSTOMER &&
              <option value="household">Household</option>
            }
          </optgroup>
        </RFFieldGroup>
      </div>
      <div style={{display: 'flex', flexGrow: 1, padding: '0 10px'}}>
        <RFFieldGroup
          type="checkbox"
          name="required"
          options="Required"
          style={{paddingRight: '10px'}}
        />
        {(fieldType === fieldTypes.RADIO || fieldType === fieldTypes.CHECKBOX) &&
          <RFFieldGroup
            type="text"
            name="choices"
            placeholder="Option 1, Option 2..."
            required
            style={{flexGrow: 1, paddingRight: '10px'}}
          />
        }
        {fieldType === widgetTypes.TABLE &&
          <RFFieldGroup
            type="text"
            name="rows"
            placeholder="Row 1, Row 2..."
            required
            style={{flexGrow: 1, paddingRight: '10px'}}
          />
        }
        {fieldType === widgetTypes.TABLE &&
          <RFFieldGroup
            type="text"
            name="cols"
            placeholder="Column 1, Column 2..."
            required
            style={{flexGrow: 1, paddingRight: '10px'}}
          />
        }
      </div>
      <ButtonToolbar style={{display: 'flex'}}>
        <Button
          onClick={handleSubmit}
          style={{backgroundColor: '#fff', height: '45px'}}
        >
          <i className="fa fa-save" />
        </Button>
        <Button
          onClick={onEdit()}
          style={{backgroundColor: '#fff', height: '45px'}}
        >
          <i className="fa fa-times" />
        </Button>
        <Button
          onClick={onDelete}
          style={{backgroundColor: '#fff', height: '45px'}}
        >
          <i className="fa fa-trash" />
        </Button>
      </ButtonToolbar>
    </div>
  </ListGroupItem>

export default compose(
  reduxForm({
    form: 'fieldForm',
    destroyOnUnmount: false,
    enableReinitialize: true,
    validate
  }),
  connect(mapStateToProps)
)(FieldEdit)

function validate(fields, props) {
  const {values} = props
  let errors = {}

  if (!fields.label.trim().length)
    errors.label = 'Label is required'

  if (fields.type === fieldTypes.RADIO) {
    if (typeof values.choices !== 'string' || !values.choices.trim().length)
      errors.choices = 'Add two or more options'
    else if (values.choices.split(',').filter(s => s.trim().length).length < 2)
      errors.choices = 'Add options separated by commas'
  }

  if (fields.type === widgetTypes.TABLE) {
    if (!values.rows)
      errors.rows = 'Add one or more comma-separated rows'
    if (!values.cols)
      errors.cols = 'Add one or more comma-separated columns'
  }

  return errors
}
