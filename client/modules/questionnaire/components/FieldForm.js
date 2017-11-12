import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit, isValid, isPristine, hasSubmitSucceeded} from 'redux-form'
import {ListGroup} from 'react-bootstrap'
import {flatMap} from 'lodash'

import selectors from '../../../store/selectors'
import {
  editField,
  deleteField,
  addField,
  updateField
} from '../reducers/editor/index'

import FieldEdit from './FieldEdit'
import FieldView from './FieldView'
import LinkField from './LinkField'

const FORM_NAME = 'fieldForm'

const mapStateToProps = state => ({
  fieldIds: selectors.qEditor.getFieldIds(state),
  getField: selectors.qEditor.getFieldById(state),
  getLinkableFields: selectors.questionnaire.getLinkableFields(state),
  editing: selectors.qEditor.getEditingField(state),
  section: selectors.qEditor.getSelectedSection(state),
  questionnaire: selectors.qEditor.getEditingQuestionnaire(state),
  submitSucceeded: hasSubmitSucceeded(FORM_NAME)(state),
  isValid: isValid(FORM_NAME)(state),
  isPristine: isPristine(FORM_NAME)(state)
})

const mapDispatchToProps = dispatch => ({
  editField: id => dispatch(editField(id)),
  deleteField: (field, sectionId) => dispatch(deleteField(field, sectionId)),
  addField: (field, sectionId, edit) => dispatch(addField(field, sectionId, edit)),
  updateField: field => dispatch(updateField(field)),
  submit: form => dispatch(submit(form))
})

class FieldForm extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.props.submitSucceeded && nextProps.submitSucceeded)
      this.handleEdit()()
  }

  handleEdit = id => () => {
    if (id && this.props.editing) return
    this.props.editField(id)
  }

  handleCancel = () => () => this.props.editField()

  handleAdd = () => this.props.addField({}, this.props.section)

  handleLink = fieldId => {
    const linkableFields = this.props.getLinkableFields(this.props.questionnaire.identifier)
    const allFields = flatMap(linkableFields, q => q.fields)
    const field = allFields.find(f => f._id === fieldId)

    this.props.addField(field, this.props.section, false)
  }

  handleDelete = id => () => {
    this.handleCancel()()
    this.props.deleteField(id, this.props.section)
  }

  handleUpdate = fields => this.props.updateField(fields)

  handleKeyUp = id => ev => {
    if (ev.keyCode === 13)
      this.submit()

    if (ev.keyCode === 27) {
      if (!this.props.isValid && this.props.isPristine)
        this.handleDelete(id)()
      else
        this.handleCancel()()
    }
  }

  submit = () => this.props.submit(FORM_NAME)

  render() {
    const {section, fieldIds, getField, editing} = this.props
    const sectionFields = section && fieldIds(section)

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '10px 0'
          }}
        >
          <h4>Fields</h4>
          <div style={{
            display: 'flex',
            margin: '0 10px'
          }}>
            <LinkField
              questionnaire={this.props.questionnaire}
              handleLink={this.handleLink}
            />
            <button
              className="btn btn-success"
              onClick={this.handleAdd}
              style={{marginLeft: '10px'}}
            >
              Add Field
            </button>
          </div>
        </div>
        <ListGroup>
          {sectionFields && sectionFields.map((id, idx) =>
            id === editing ?
              <FieldEdit
                form={FORM_NAME}
                key={id}
                onSubmit={this.handleUpdate}
                onEdit={this.handleCancel}
                onDelete={this.handleDelete(id)}
                onKeyUp={this.handleKeyUp(id)}
                initialValues={getField(id)}
              /> :
              <FieldView
                key={id}
                idx={idx}
                field={getField(id)}
                onSelect={this.handleEdit(id)}
              />
          )}
        </ListGroup>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FieldForm)
