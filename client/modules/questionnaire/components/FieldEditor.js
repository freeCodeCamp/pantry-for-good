import React from 'react'
import {connect} from 'react-redux'
import sortBy from 'lodash/sortBy'
import {Table} from 'react-bootstrap'

import {selectors} from '../../../store'
import {saveField, deleteField} from '../field-reducer'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import EditableRow from './EditableRow'
import FieldGroup from '../../../components/FieldGroup'


const mapStateToProps = state => ({
  error: selectors.loadFormDataError(state) || selectors.saveFieldError(state),
  loading: selectors.loadingFormData(state),
  formData: selectors.getFormData(state),
  questionnaires: selectors.getAllQuestionnaires(state),
})

const mapDispatchToProps = dispatch => ({
  onSave: field => () => dispatch(saveField(field)),
  onDelete: field => () => dispatch(deleteField(field._id))
})

const FieldEditor = ({
  newModel,
  editModel,
  onSave,
  onDelete,
  onNewFieldChange,
  onEditFieldChange,
  onShowEdit,
  editing,
  error,
  loading,
  formData
}) => {
  const fields = sortBy(formData.fields, ['section', 'row', 'column'])
  const sections = sortBy(formData.sections, ['questionnaire', 'position'])
  const {columns, actions, headerActions} = getRowData(sections, onSave, onDelete)

  return (
    <Box>
      <BoxHeader heading="Fields">
        <FieldGroup
          name="search"
          type="search"
          placeholder="Search"
          icon="search"
          formGroupClass="box-tools"
        />
      </BoxHeader>
      <BoxBody loading={loading} error={error}>
        <form name="fieldForm">
          <Table responsive striped>
            <thead>
              <tr>
                <th>Label</th>
                <th>Name</th>
                <th>Section</th>
                <th>Type</th>
                <th>Choices</th>
                <th>Row</th>
                <th>Column</th>
                <th>Span</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <EditableRow
                header
                model={newModel}
                onFieldChange={onNewFieldChange}
                columns={getRowData(sections).columns}
                actions={headerActions}
              />

              {fields && fields.map((field, i) =>
                <EditableRow
                  key={i}
                  model={editing === field._id ? editModel : field}
                  editing={editing === field._id}
                  onFieldChange={onEditFieldChange}
                  onShowEdit={onShowEdit}
                  columns={columns}
                  actions={actions}
                />
              )}

              {!fields || !fields.length &&
                <tr>
                  <td className="text-center" colSpan="7">No fields yet.</td>
                </tr>
              }
            </tbody>
          </Table>
        </form>
      </BoxBody>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(FieldEditor)

function getRowData(sections, onSave, onDelete) {
  const columns = [{
    label: {textarea: {rows: 3}}
  }, {
    name: 'text'
  }, {
    section: {
      select: {
        options: sections.map(section => ({label: section.name, value: section._id}))
      }
    }
  }, {
    type: {
      select: {
        options: ['Text', 'Textarea', 'Date', 'Radio Buttons', 'Checkboxes', 'Table']
      }
    }
  }, {
    choices: 'text'
  }, {
    row: {number: {min: 1, max: 20}}
  }, {
    column: {number: {min: 1, max: 4}}
  }, {
    span: {number: {min: 1, max: 4}}
  }]

  const actions = [{
    label: 'Save',
    onClick: onSave,
    buttonType: 'success'
  }, {
    label: 'Delete',
    onClick: onDelete,
    buttonType: 'danger'
  }]

  const headerActions = [{
    label: 'Add',
    onClick: onSave,
    buttonType: 'success'
  }]

  return {columns, actions, headerActions}
}

