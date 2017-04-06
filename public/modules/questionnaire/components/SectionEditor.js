import React from 'react'
import {connect} from 'react-redux'
import {Table} from 'react-bootstrap'
import sortBy from 'lodash/sortBy'

import {selectors} from '../../../store'
import {saveSection, deleteSection} from '../../../store/section'

const mapStateToProps = state => ({
  error: selectors.loadFormDataError(state) || selectors.saveSectionError(state),
  loading: selectors.loadingFormData(state),
  formData: selectors.getFormData(state),
  questionnaires: selectors.getAllQuestionnaires(state),
})

const mapDispatchToProps = dispatch => ({
  onSave: section => () => dispatch(saveSection(section)),
  onDelete: section => () => dispatch(deleteSection(section._id))
})

const SectionEditor = ({
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
  const sections = sortBy(formData.sections, ['questionnaire', 'position'])
  return (
    <div className="row">
      <div className="col-xs-12">
        <div className="box">
          <div className="box-header">
            <h3 className="box-title">Sections</h3>
            <div className="box-tools">
            </div>
            {error &&
              <div className="text-danger">
                <strong>{error}</strong>
              </div>
            }
          </div>
          <div className="box-body table-responsive no-padding top-buffer">
            <form name="sectionForm" onSubmit={editing ? noop : onSave(model)}>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Section Name</th>
                    <th>Questionnaire</th>
                    <th>Position</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        className="form-control"
                        type="text"
                        value={editing || !model ? '' : model.name}
                        onChange={onFieldChange('name')}
                        placeholder="Section Name"
                        disabled={editing}
                      />
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={editing || !model ? '' : model.questionnaire}
                        onChange={onFieldChange('questionnaire')}
                        disabled={editing}
                        required
                      >
                        <option value="">Select Questionnaire</option>
                        {questionnaires.map(questionnaire =>
                          <option key={questionnaire._id} value={questionnaire._id}>
                            {questionnaire.name}
                          </option>
                        )}
                      </select>
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="text"
                        value={editing || !model ? '' : model.position}
                        onChange={onFieldChange('position')}
                        placeholder="Position"
                      />
                    </td>
                    <td>
                      <button className="btn btn-success btn-flat" type="submit">
                        <i className="fa fa-plus"></i> Add Item
                      </button>
                    </td>
                  </tr>
                  {sections && sections.map((section, i) =>
                    <SectionRow
                      key={i}
                      editing={editing}
                      section={section}
                      questionnaires={questionnaires}
                      model={model}
                      onFieldChange={onFieldChange}
                      onSave={onSave}
                      onDelete={onDelete}
                      onShowEdit={onShowEdit}
                    />
                  )}
                  {!sections || !sections.length &&
                    <tr>
                      <td className="text-center" colSpan="4">No sections yet.</td>
                    </tr>
                  }
                </tbody>
              </Table>
            </form>
          </div>
          {loading &&
            <div className="overlay">
              <i className="fa fa-refresh fa-spin"></i>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionEditor)

function noop() {return () => {}}

function SectionRow({
  editing,
  section,
  questionnaires,
  model,
  onFieldChange,
  onSave,
  onDelete,
  onShowEdit
}) {
  if (editing === section._id) return (
    <tr>
      <td>
        <input
          className="form-control"
          type="text"
          value={model.name}
          onChange={onFieldChange('name')}
        />
      </td>
      <td>
        <select
          className="form-control"
          value={model.questionnaire}
          onChange={onFieldChange('questionnaire')}
        >
          {questionnaires.map((questionnaire, i) =>
            <option key={i} value={questionnaire._id}>
              {questionnaire.name}
            </option>
          )}
        </select>
      </td>
      <td>
        <input
          className="form-control"
          type="text"
          value={model.position}
          onChange={onFieldChange('position')}
        />
      </td>
      <td>
        <a onClick={onSave(model)} className="btn btn-success btn-flat btn-xs"><i className="fa fa-download"></i> Save</a>
        {!section.logicReq &&
          <a onClick={onDelete(section)} className="btn btn-danger btn-flat btn-xs"><i className="fa fa-trash"></i> Delete</a>
        }
        <a onClick={onShowEdit()} className="btn btn-primary btn-flat btn-xs"><i className="fa fa-times"></i> Cancel</a>
      </td>
    </tr>
  )

  return (
    <tr>
      <td><span>{section.name}</span></td>
      <td><span>{section.questionnaire.name}</span></td>
      <td><span>{section.position}</span></td>
      <td>
        <a onClick={onShowEdit(section)} className="btn btn-primary btn-flat btn-xs"><i className="fa fa-pencil"></i> Edit</a>
      </td>
    </tr>
  )
}