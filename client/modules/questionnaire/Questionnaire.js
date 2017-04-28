import React, {Component} from 'react'
import {connect} from 'react-redux'
import {get, head, sortBy} from 'lodash'
import {Button, Col} from 'react-bootstrap'

import {selectors} from '../../store'
import {loadQuestionnaires, saveQuestionnaire} from './questionnaire-reducer'

import {Page, PageBody} from '../../components/page'
import {Box, BoxBody, BoxHeader} from '../../components/box'
import QuestionnaireSelector from './components/QuestionnaireSelector'
import SectionForm from './components/SectionForm'
import FieldForm from './components/FieldForm'

import './questionnaire.css'

const mapStateToProps = state => ({
  questionnaires: sortBy(selectors.getAllQuestionnaires(state), 'name'),
  loading: selectors.loadingQuestionnaires(state),
  saving: selectors.savingQuestionnaires(state),
  error: selectors.loadQuestionnairesError(state) ||
    selectors.saveQuestionnairesError(state)
})

const mapDispatchToProps = dispatch => ({
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  saveQuestionnaire: questionnaire => dispatch(saveQuestionnaire(questionnaire))
})

class Questionnaire extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questionnaireModel: null,
      selectedSection: null,
      selectedField: null
    }
  }

  componentWillMount() {
    this.props.loadQuestionnaires()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading) {
      const questionnaire = nextProps.questionnaires.find(q =>
        q.identifier === 'qCustomers')

      const firstSection = head(sortBy(questionnaire.sections, 'position'))

      this.setState({
        questionnaireModel: {...questionnaire},
        selectedSection: firstSection.position
      })
    }
  }

  handleQuestionnaireSelect = identifier => {
    const questionnaire = this.props.questionnaires.find(q =>
      q.identifier === identifier)
    const firstSection = head(sortBy(questionnaire.sections, 'position'))

    this.setState({
      questionnaireModel: {...questionnaire},
      selectedSection: firstSection.position,
      selectedField: null
    })
  }

  handleSectionSelect = position => {
    this.setState({
      selectedSection: position,
      selectedField: null
    })
  }

  handleFieldSelect = position => {
    this.setState({
      selectedField: position,
    })
  }

  handleSectionChange = section => {
    const {sections} = this.state.questionnaireModel

    const updatedModel = {
      ...this.state.questionnaireModel,
      sections: sections.map(s => s._id === section._id ? section : s)
    }

    this.setState({
      questionnaireModel: updatedModel
    })
  }

  handleFieldChange = fieldId => ev => {
    const {name, value} = ev.target
    const {sections} = this.state.questionnaireModel

    const updatedModel = {
      ...this.state.questionnaireModel,
      sections: sections.map(section => ({
        ...section,
        fields: section.fields.map(field =>
          field._id === fieldId ?
            {...field, [name]: value} :
            field
        )
      }))
    }

    this.setState({
      questionnaireModel: updatedModel
    })
  }

  handleFieldKeyUp = ev => {
    if (ev.keyCode === 13) this.handleSave()
    if (ev.keyCode === 27) this.setState({selectedField: null})
  }

  handleSave = () => {
    this.setState({selectedField: null})
    this.props.saveQuestionnaire(this.state.questionnaireModel)
  }

  render() {
    const {questionnaires, loading, saving, error} = this.props
    const {questionnaireModel, selectedSection, selectedField} = this.state

    const sections = get(questionnaireModel, 'sections', [])
    const section = sections.find(s => s.position === selectedSection)
    const fields = section ? section.fields : []

    return (
      <Page>
        <PageBody>
          <Box>
            <BoxHeader heading="Edit Application Forms" />
            <BoxBody loading={loading || saving} error={error}>
              {questionnaireModel &&
                <div>
                  <QuestionnaireSelector
                    selected={questionnaireModel}
                    onSelect={this.handleQuestionnaireSelect}
                    questionnaires={questionnaires}
                  />
                  <Col xs={12} sm={5} md={4} lg={3}>
                    <SectionForm
                      selectedSection={selectedSection}
                      onSelect={this.handleSectionSelect}
                      onChange={this.handleSectionChange}
                      sections={sections}
                    />
                  </Col>
                  <Col xs={12} sm={7} md={8} lg={9}>
                    <FieldForm
                      selectedField={selectedField}
                      onSelect={this.handleFieldSelect}
                      onChange={this.handleFieldChange}
                      onKeyUp={this.handleFieldKeyUp}
                      fields={fields}
                    />
                  </Col>
                  <Col xs={12}>
                    <div className="text-right">
                      <Button bsStyle="success" onClick={this.handleSave}>
                        Save
                      </Button>
                    </div>
                  </Col>
                </div>
              }
            </BoxBody>
          </Box>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Questionnaire)
