import React from 'react'
import {connect} from 'react-redux'
import sortBy from 'lodash/sortBy'
import {Table} from 'react-bootstrap'

import {selectors} from '../../../store'
import {saveField, deleteField} from '../field-reducer'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
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
  error,
  loading,
  onSave,
  onDelete,
  model,
  formData,
  questionnaires,
  onFieldChange,
  onShowEdit,
  editing
}) => {
  const fields = sortBy(formData.fields, ['section', 'row', 'column'])
  const sections = sortBy(formData.sections, ['questionnaire', 'position'])
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
        <form name="fieldForm" onSubmit={editing ? noop : onSave(model)}>
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
              <tr>
                <td>
                  <textarea
                    className="form-control"
                    value={editing || !model ? '' : model.label}
                    onChange={onFieldChange('label')}
                    placeholder="Field Label"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value={editing || !model ? '' : model.name}
                    onChange={onFieldChange('name')}
                    placeholder="Field Name"
                  />
                </td>
                <td>
                  <select
                    className="form-control"
                    value={editing || !model ? '' : model.section}
                    onChange={onFieldChange('section')}
                    required
                  >
                    <option value="">Select Section</option>
                    {sections && sections.map(section =>
                      <option key={section._id} value={section._id}>
                        {section.name}
                      </option>
                    )}
                  </select>
                </td>
                <td>
                  <select
                    className="form-control"
                    value={editing || !model ? '' : model.type}
                    onChange={onFieldChange('type')}
                  >
                    <option value="">Select Type</option>
                    <option value="Text">Text</option>
                    <option value="Textarea">Textarea</option>
                    <option value="Date">Date</option>
                    <option value="Radio Buttons">Radio Buttons</option>
                    <option value="Checkboxes">Checkboxes</option>
                    <option value="Lookup">Lookup</option>
                    <option value="Table">Table</option>
                  </select>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value={editing || !model ? '' : model.choices}
                    onChange={onFieldChange('choices')}
                    placeholder="Choices"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number" min="1" max="20"
                    value={editing || !model ? '' : model.row}
                    onChange={onFieldChange('row')}
                    placeholder="Row"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number" min="1" max="4"
                    value={editing || !model ? '' : model.column}
                    onChange={onFieldChange('column')}
                    placeholder="Column"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number" min="1" max="4"
                    value={editing || !model ? '' : model.span}
                    onChange={onFieldChange('span')}
                    placeholder="Span"
                  />
                </td>
                <td>
                  <button className="btn btn-success btn-flat" type="submit">
                    <i className="fa fa-plus"></i> Add Item
                  </button>
                </td>
              </tr>

              {fields && fields.map((field, i) =>
                <FieldRow
                  key={i}
                  editing={editing}
                  field={field}
                  sections={sections}
                  questionnaires={questionnaires}
                  model={model}
                  onFieldChange={onFieldChange}
                  onSave={onSave}
                  onDelete={onDelete}
                  onShowEdit={onShowEdit}
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

function noop() {return () => {}}

function FieldRow({
  editing,
  field,
  sections,
  questionnaires,
  model,
  onFieldChange,
  onSave,
  onDelete,
  onShowEdit
}) {
  if (editing === field._id) return (
    <tr>
      <td>
        <textarea
          className="form-control"
          type="text"
          rows="3"
          value={model.label}
          onChange={onFieldChange('label')}
        />
      </td>
      <td>
        <input
          className="form-control"
          type="text"
          value={model.name}
          onChange={onFieldChange('name')}
        />
          {/*disabled="field.logicReq">*/}
      </td>
      <td>
        <select
          className="form-control"
          value={model.section}
          onChange={onFieldChange('section')}
        >
          <option value="">Select Section</option>
          {sections && sections.map(section =>
            <option key={section._id} value={section._id}>
              {section.name}
            </option>
          )}
        </select>
      </td>
      <td>
        <select
          className="form-control"
          value={model.type}
          onChange={onFieldChange('type')}
        >
          <option value="Text">Text</option>
          <option value="Textarea">Textarea</option>
          <option value="Date">Date</option>
          <option value="Radio Buttons">Radio Buttons</option>
          <option value="Checkboxes">Checkboxes</option>
          <option value="Table">Table</option>
        </select>
        {/*data-ng-disabled="field.logicReq">*/}
      </td>
      <td>
        <input
          className="form-control"
          type="text"
          value={model.choices}
          onChange={onFieldChange('choices')}
        />
      </td>
      <td>
        <input
          className="form-control"
          type="number" min="1" max="20"
          value={model.row}
          onChange={onFieldChange('row')}
        />
      </td>
      <td>
        <input
          className="form-control"
          type="number" min="1" max="4"
          value={model.column}
          onChange={onFieldChange('column')}
        />
      </td>
      <td>
        <input
          className="form-control"
          type="number" min="1" max="4"
          value={model.span}
          onChange={onFieldChange('span')}
        />
      </td>
      <td>
        <a onClick={onSave(model)} className="btn btn-success btn-flat btn-xs"><i className="fa fa-download"></i> Save</a>
        {!field.logicReq &&
          <a onClick={onDelete(field)} className="btn btn-danger btn-flat btn-xs"><i className="fa fa-trash"></i> Delete</a>
        }
        <a onClick={onShowEdit()} className="btn btn-primary btn-flat btn-xs"><i className="fa fa-times"></i> Cancel</a>
      </td>
    </tr>
  )

  return (
    <tr>
      <td><span>{field.label}</span></td>
      <td><span>{field.name}</span></td>
      <td><span>{field.section.name}</span></td>
      <td><span>{field.type}</span></td>
      <td><span>{field.choices}</span></td>
      <td><span>{field.row}</span></td>
      <td><span>{field.column}</span></td>
      <td><span>{field.span}</span></td>
      <td>
        <a onClick={onShowEdit(field)} className="btn btn-primary btn-flat btn-xs"><i className="fa fa-pencil"></i> Edit</a>
      </td>
    </tr>
  )
}
