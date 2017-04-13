import React, {Component} from 'react'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import get from 'lodash/get'

import {selectors} from '../../../store'
import {loadQuestionnaires, saveQuestionnaire, deleteQuestionnaire} from '../questionnaire-reducer'
import {loadFields, saveField, deleteField} from '../field-reducer'
import {loadSections, saveSection, deleteSection} from '../section-reducer'

import {Page, PageHeader, PageBody} from '../../../components/page'
import EditableTable from './EditableTable'

import {
  actions,
  questionnaireTable,
  getSectionTable,
  getFieldTable
} from './table-data'

const mapStateToProps = state => ({
  user: state.auth.user,
  settings: state.settings.data,
  questionnaires: selectors.getAllQuestionnaires(state),
  formData: selectors.getFormData(state),
  loadingQuestionnaires: selectors.loadingQuestionnaires(state),
  loadQuestionnairesError: selectors.loadQuestionnairesError(state),
  loadingSections: selectors.loadingSections(state),
  loadSectionsError: selectors.loadSectionsError(state),
  loadingFields: selectors.loadingFields(state),
  loadFieldsError: selectors.loadFieldsError(state),
  savingQuestionnaires: selectors.savingQuestionnaires(state),
  saveQuestionnairesError: selectors.saveQuestionnairesError(state),
  savingSections: selectors.savingSections(state),
  saveSectionsError: selectors.saveSectionsError(state),
  savingFields: selectors.savingFields(state),
  saveFieldsError: selectors.saveFieldsError(state),
})

const mapDispatchToProps = dispatch => ({
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  loadFormData: () => {
    dispatch(loadFields())
    dispatch(loadSections())
  },
  saveQuestionnaire: questionnaire => dispatch(saveQuestionnaire(questionnaire)),
  saveSection: section => dispatch(saveSection(section)),
  saveField: field => dispatch(saveField(field)),
  deleteQuestionnaire: questionnaire => () =>dispatch(deleteQuestionnaire(questionnaire._id)),
  deleteSection: section => () => dispatch(deleteSection(section._id)),
  deleteField: field => () => dispatch(deleteField(field._id)),
  reset: form => dispatch(reset(form))
})

class Questionnaire extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questionnaireEdit: null,
      sectionEdit: null,
      fieldEdit: null,
    }
  }

  componentWillMount() {
    this.props.loadQuestionnaires()
    this.props.loadFormData()
  }

  handleShowEdit = key => item => () =>
    this.setState({
      [key]: item && item._id
    })

  render() {
    const {
      questionnaireEdit,
      sectionEdit,
      fieldEdit,
    } = this.state

    const {
      questionnaires,
      formData,
      loadingQuestionnaires,
      loadQuestionnairesError,
      savingQuestionnaires,
      saveQuestionnairesError,
      loadingSections,
      loadSectionsError,
      savingSections,
      saveSectionsError,
      loadingFields,
      loadFieldsError,
      savingFields,
      saveFieldsError
    } = this.props

    const sectionTable = getSectionTable(questionnaires)
    const fieldTable = getFieldTable(formData.sections)

    return (
      <Page>
        <PageHeader heading="Questionnaire Editor" />
        <PageBody>
          <EditableTable
            heading={questionnaireTable.title}
            name="questionnaires"
            searchable
            rows={questionnaires}
            columns={questionnaireTable.columns}
            actions={actions}
            fetching={loadingQuestionnaires || savingQuestionnaires}
            error={loadQuestionnairesError || saveQuestionnairesError}
            editing={questionnaireEdit}
            onSave={this.props.saveQuestionnaire}
            onEdit={this.handleShowEdit('questionnaireEdit')}
            onDelete={this.props.deleteQuestionnaire}
          />
          <EditableTable
            heading={sectionTable.title}
            name="sections"
            rows={formData.sections}
            columns={sectionTable.columns}
            actions={actions}
            fetching={loadingSections || savingSections}
            error={loadSectionsError || saveSectionsError}
            editing={sectionEdit}
            onSave={this.props.saveSection}
            onEdit={this.handleShowEdit('sectionEdit')}
            onDelete={this.props.deleteSection}
          />
          <EditableTable
            heading={fieldTable.title}
            name="fields"
            rows={formData.fields}
            columns={fieldTable.columns}
            actions={actions}
            fetching={loadingFields || savingFields}
            error={loadFieldsError || saveFieldsError}
            editing={fieldEdit}
            onSave={this.props.saveField}
            onEdit={this.handleShowEdit('fieldEdit')}
            onDelete={this.props.deleteField}
          />
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Questionnaire)
