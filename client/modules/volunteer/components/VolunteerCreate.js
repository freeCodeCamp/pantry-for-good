import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {utc} from 'moment'
import {set} from 'lodash'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {toForm, fromForm} from '../../../lib/fields-adapter'
import selectors from '../../../store/selectors'
import {saveVolunteer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import AssistanceInfo from '../../../components/AssistanceInfo'
import {Page, PageBody, PageHeader} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'
import VolunteerWaiver from './VolunteerWaiver'

const FORM_NAME = 'volunteerForm'

const mapStateToProps = state => ({
  user: selectors.user.getUser(state),
  savingVolunteers: selectors.volunteer.saving(state),
  saveVolunteersError: selectors.volunteer.saveError(state),
  questionnaire: selectors.questionnaire.getOne(state)('qVolunteers'),
  loading: selectors.questionnaire.loading(state),
  loadError: selectors.questionnaire.loadError(state),
  settings: selectors.settings.getSettings(state)
})

const mapDispatchToProps = dispatch => ({
  saveVolunteer: volunteer => dispatch(saveVolunteer(volunteer)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  push: route => dispatch(push(route)),
  submit: form => dispatch(submit(form))
})

class VolunteerCreate extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.state = {
      volunteerModel: {
        ...this.props.user,
        fields: []
      }
    }
  }

  componentWillMount() {
    this.props.loadQuestionnaires()
  }

  componentWillReceiveProps(nextProps) {
    const {savingVolunteers, saveVolunteersError} = nextProps

    if (!savingVolunteers && this.props.savingVolunteers && !saveVolunteersError) {
      this.props.push(this.isAdmin ? '/volunteers' : '/')
    }
  }

  saveVolunteer = fields => {
    if (!this.state.volunteerModel) return
    this.props.saveVolunteer({
      ...this.state.volunteerModel,
      fields: fromForm(fields)
    }, this.isAdmin)
  }

  submit = () => this.props.submit(FORM_NAME)

  handleFieldChange = (field, value) => ev => {
    if (!value) value = ev.target.value
    let items

    if (ev.target.type === 'checkbox')
      items = this.formMethods.toggleCheckbox(this.state.volunteerModel, field, value)

    const volunteerModel = set({...this.state.volunteerModel}, field, items || value)
    this.setState({volunteerModel})
  }

  isMinor = () => {
    const dateOfBirth = this.state.volunteerModel.dateOfBirth
    return dateOfBirth && utc().diff(dateOfBirth, 'years') < 18
  }

  render() {
    const {settings, questionnaire, loading, loadError, savingVolunteers} = this.props
    const {volunteerModel} = this.state

    return (
      <Page>
        <PageHeader
          showLogo
          center
          heading="Volunteer Application"
        />
        <PageBody
          error={loadError || this.props.saveVolunteersError}
        >
          {settings && <AssistanceInfo settings={settings} />}
          <form onSubmit={this.saveVolunteer}>
            {volunteerModel && questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                model={volunteerModel}
                questionnaire={questionnaire}
                loading={loading || savingVolunteers}
                onSubmit={this.saveVolunteer}
                initialValues={toForm(volunteerModel, questionnaire)}
              />
            }
            {/*<VolunteerWaiver
              settings={settings}
              model={volunteerModel}
              onFieldChange={this.handleFieldChange}
              isMinor={this.isMinor()}
            />*/}
            <div className="text-right">
              <Button
                type="button"
                bsStyle="success"
                onClick={this.submit}
              >Submit</Button>
              {' '}
              <Link className="btn btn-primary" to="/">Cancel</Link>
            </div>
          </form>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerCreate)
