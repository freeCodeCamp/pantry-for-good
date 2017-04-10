import React, {Component} from 'react'
import {connect} from 'react-redux'
import get from 'lodash/get'

import {selectors} from '../../../store'
import {loadQuestionnaires} from '../questionnaire-reducer'
import {loadFields} from '../field-reducer'
import {loadSections} from '../section-reducer'

import Page from '../../../components/Page'
import QuestionnaireEditor from './QuestionnaireEditor'
import SectionEditor from './SectionEditor'
import FieldEditor from './FieldEditor'

const mapStateToProps = state => ({
  user: state.auth.user,
  settings: state.settings.data,
})

const mapDispatchToProps = dispatch => ({
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  loadFormData: () => {
    dispatch(loadFields())
    dispatch(loadSections())
  }
})

class Questionnaire extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // should have separate models for new and edit so editing doesn't wipe out new fields
      questionnaireModel: null,
      questionnaireEdit: null,
      sectionModel: null,
      sectionEdit: null,
      fieldModel: null,
      fieldEdit: null
    }
  }

  componentWillMount() {
    this.props.loadQuestionnaires()
    this.props.loadFormData()
  }

  handleFieldChange = stateKey => field => ev => {

    this.setState({
      [stateKey]: {
        ...get(this.state, stateKey),
        [field]: ev.target.value
      }
    })
  }

  handleShowEdit = (editKey, modelKey) => item => () =>
    this.setState({
      [editKey]: item && item._id,
      [modelKey]: {...item}
    })

  render() {
    const {
      questionnaireModel,
      questionnaireEdit,
      sectionModel,
      sectionEdit,
      fieldModel,
      fieldEdit,
    } = this.state

    return (
      <Page heading="Questionnaire Editor">
        <QuestionnaireEditor
          model={questionnaireModel}
          onFieldChange={this.handleFieldChange('questionnaireModel')}
          onShowEdit={this.handleShowEdit('questionnaireEdit', 'questionnaireModel')}
          editing={questionnaireEdit}
        />
        <SectionEditor
          model={sectionModel}
          onFieldChange={this.handleFieldChange('sectionModel')}
          onShowEdit={this.handleShowEdit('sectionEdit', 'sectionModel')}
          editing={sectionEdit}
        />
        <FieldEditor
          model={fieldModel}
          onFieldChange={this.handleFieldChange('fieldModel')}
          onShowEdit={this.handleShowEdit('fieldEdit', 'fieldModel')}
          editing={fieldEdit}
        />
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Questionnaire)
