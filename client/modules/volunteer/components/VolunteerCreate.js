import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {toForm, fromForm} from '../../../lib/fields-adapter'
import selectors from '../../../store/selectors'
import {saveVolunteer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import AssistanceInfo from '../../../components/AssistanceInfo'
import {Page, PageBody, PageHeader} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

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
    this.volunteer = {
      ...this.props.user,
      fields: []
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

  saveVolunteer = form =>
    this.props.saveVolunteer(fromForm(form), this.isAdmin)

  submit = () => this.props.submit(FORM_NAME)

  render() {
    const {settings, questionnaire, loading, loadError, savingVolunteers} = this.props

    return (
      <Page loading={loading}>
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
            {questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                questionnaire={questionnaire}
                loading={savingVolunteers}
                onSubmit={this.saveVolunteer}
                initialValues={toForm(this.volunteer, questionnaire)}
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
