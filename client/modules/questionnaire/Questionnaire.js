import React, {Component} from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {sortBy} from 'lodash'
import {Button, Col} from 'react-bootstrap'

import {questionnaireIdentifiers} from '../../../common/constants'
import selectors from '../../store/selectors'
import {loadQuestionnaires, saveQuestionnaire} from './reducers/api'
import {init, selectSection, editField} from './reducers/editor/index'
import {showConfirmDialog, showNavDialog, hideDialog} from '../core/reducers/dialog'

import {Page, PageBody} from '../../components/page'
import {Box, BoxBody, BoxHeader} from '../../components/box'
import withConfirmNavigation from '../../components/withConfirmNavigation'
import QuestionnaireSelector from './components/QuestionnaireSelector'
import SectionForm from './components/SectionForm'
import FieldForm from './components/FieldForm'

import './questionnaire.css'

const mapStateToProps = state => ({
  questionnaires: sortBy(selectors.questionnaire.getAll(state), 'name'),
  getQuestionnaire: selectors.questionnaire.getOne(state),
  loading: selectors.questionnaire.loading(state),
  saving: selectors.questionnaire.saving(state),
  error: selectors.questionnaire.loadError(state) ||
    selectors.questionnaire.saveError(state),
  completeQuestionnaire: selectors.qEditor.getCompleteQuestionnaire(state),
  sectionIds: selectors.qEditor.getSectionIds(state),
  dirty: selectors.qEditor.isDirty(state)
})

const mapDispatchToProps = dispatch => ({
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  saveQuestionnaire: questionnaire => dispatch(saveQuestionnaire(questionnaire)),
  init: questionnaire => dispatch(init(questionnaire)),
  selectSection: sectionId => dispatch(selectSection(sectionId)),
  editField: fieldId => dispatch(editField(fieldId)),
  showNavDialog: (cancel, confirm) => dispatch(showNavDialog(cancel, confirm)),
  showConfirmDialog: (cancel, confirm, message) =>
    dispatch(showConfirmDialog(cancel, confirm, message, 'Save')),
  hideDialog: () => dispatch(hideDialog())
})

class Questionnaire extends Component {
  componentWillMount() {
    this.props.loadQuestionnaires()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading) {
      const questionnaire = nextProps.getQuestionnaire(questionnaireIdentifiers.CUSTOMER)

      this.props.init(questionnaire)
      if (questionnaire && questionnaire.sections && questionnaire.sections.length)
        this.props.selectSection(questionnaire.sections[0]._id)
    }
  }

  handleQuestionnaireSelect = identifier => {
    if (this.props.dirty)
      this.props.showNavDialog(this.props.hideDialog, this.selectQuestionnaire(identifier))
    else
      this.selectQuestionnaire(identifier)()
  }

  selectQuestionnaire = identifier => () => {
    const questionnaire = this.props.questionnaires.find(q =>
      q.identifier === identifier)

    this.props.init(questionnaire)
    this.props.selectSection(questionnaire.sections[0]._id)
    this.props.hideDialog()
  }

  handleSave = () => this.props.showConfirmDialog(
    this.props.hideDialog,
    this.saveQuestionnaire,
    'Any deleted fields will be permanently lost'
  )

  saveQuestionnaire = () => {
    this.props.editField(null)
    this.props.saveQuestionnaire(this.props.completeQuestionnaire)
    this.props.hideDialog()
  }

  render() {
    const {loading, saving, error} = this.props

    return (
      <Page>
        <PageBody>
          <Box>
            <BoxHeader heading="Edit Application Forms" />
            <BoxBody loading={loading || saving} error={error}>
              <QuestionnaireSelector
                onSelect={this.handleQuestionnaireSelect}
              />
              <Col xs={12} sm={5} md={4} lg={3}>
                <SectionForm />
              </Col>
              <Col xs={12} sm={7} md={8} lg={9}>
                <FieldForm />
              </Col>
              <Col xs={12}>
                <div className="text-right">
                  <Button
                    bsStyle="success"
                    onClick={this.handleSave}
                    disabled={!this.props.dirty}
                  >
                    Save
                  </Button>
                </div>
              </Col>
            </BoxBody>
          </Box>
        </PageBody>
      </Page>
    )
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withConfirmNavigation,
  DragDropContext(HTML5Backend)
)(Questionnaire)
