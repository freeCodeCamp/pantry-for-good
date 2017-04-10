import React from 'react'
import {connect} from 'react-redux'
import {Table} from 'react-bootstrap'
import sortBy from 'lodash/sortBy'

import {selectors} from '../../../store'
import {saveQuestionnaire, deleteQuestionnaire} from '../questionnaire-reducer'

const mapStateToProps = state => ({
  error: selectors.loadQuestionnairesError(state),
  loading: selectors.loadingQuestionnaires(state),
  questionnaires: selectors.getAllQuestionnaires(state),
})

const mapDispatchToProps = dispatch => ({
  onSave: questionnaire => () => dispatch(saveQuestionnaire(questionnaire)),
  onDelete: questionnaire => () => dispatch(deleteQuestionnaire(questionnaire._id))
})

const QuestionnaireEditor = ({
  model,
  onFieldChange,
  onShowEdit,
  editing,
  error,
  loading,
  onSave,
  onDelete,
  questionnaires
}) =>
  <div className="row">
    <div className="col-xs-12">
      <div className="box">
        <div className="box-header">
          <h3 className="box-title">Questionnaires</h3>
          <div className="box-tools">
            <div className="form-group has-feedback">
              <input
                className="form-control"
                type="search"
                placeholder="Search"
              />
              <span className="glyphicon glyphicon-search form-control-feedback"></span>
            </div>
          </div>
          {error &&
            <div className="text-danger">
              <strong>{error}</strong>
            </div>
          }
        </div>
        <div className="box-body table-responsive no-padding top-buffer">
          <form name="questionnaireForm" onSubmit={editing ? noop : onSave(model)}>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Identifier</th>
                  <th>Description</th>
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
                      placeholder="Questionnaire Name"
                      disabled={editing}
                    />
                  </td>
                  <td>
                    <input
                      className="form-control"
                      type="text"
                      value={editing || !model ? '' : model.identifier}
                      onChange={onFieldChange('identifier')}
                      placeholder="Short identifier"
                      disabled={editing}
                    />
                  </td>
                  <td>
                    <input
                      className="form-control"
                      type="text"
                      value={editing || !model ? '' : model.description}
                      onChange={onFieldChange('description')}
                      placeholder="Description"
                      disabled={editing}
                    />
                  </td>
                  <td>
                    <button className="btn btn-success btn-flat" type="submit">
                      <i className="fa fa-plus"></i> Add Item
                    </button>
                  </td>
                </tr>
                {questionnaires && questionnaires.map((questionnaire, i) =>
                  <QuestionnaireRow
                    key={i}
                    editing={editing}
                    questionnaire={questionnaire}
                    model={model}
                    onFieldChange={onFieldChange}
                    onSave={onSave}
                    onDelete={onDelete}
                    onShowEdit={onShowEdit}
                  />
                )}
                {!questionnaires.length &&
                  <tr>
                    <td className="text-center" colSpan="4">No questionnaires yet.</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(QuestionnaireEditor)

function noop() {return () => {}}

function QuestionnaireRow({editing, questionnaire, model, onFieldChange,
    onSave, onDelete, onShowEdit}) {
  if (editing === questionnaire._id) return (
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
        <input
          className="form-control"
          type="text"
          value={model.identifier}
          onChange={onFieldChange('identifier')}
        />
      </td>
      <td>
        <input
          className="form-control"
          type="text"
          value={model.description}
          onChange={onFieldChange('description')}
        />
      </td>
      <td className="col-xs-3">
        <a
          onClick={onSave(model)}
          className="btn btn-success btn-flat btn-xs"
        ><i className="fa fa-download"></i> Save</a>
        {!questionnaire.logicReq &&
          <a
            onClick={onDelete(questionnaire)}
            className="btn btn-danger btn-flat btn-xs"
          ><i className="fa fa-trash"></i> Delete</a>
        }
        <a
          onClick={onShowEdit()}
          className="btn btn-primary btn-flat btn-xs"
        ><i className="fa fa-times"></i> Cancel</a>
      </td>
    </tr>
  )

  return (
    <tr>
      <td><span>{questionnaire.name}</span></td>
      <td><span>{questionnaire.identifier}</span></td>
      <td><span>{questionnaire.description}</span></td>
      <td className="col-xs-3">
        <a
          onClick={onShowEdit(questionnaire)}
          className="btn btn-primary btn-flat btn-xs"
        ><i className="fa fa-pencil"></i> Edit</a>
      </td>
    </tr>
  )
}