import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {ADMIN_ROLE, questionnaireIdentifiers} from '../../../../common/constants'
import {toForm, fromForm} from '../../../lib/questionnaire-helpers'
import selectors from '../../../store/selectors'
import {loadVolunteer, saveVolunteer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Page, PageBody, PageHeader} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'volunteerForm'

const mapStateToProps = (state, ownProps) => ({
  user: selectors.auth.getUser(state),
  getVolunteer: selectors.volunteer.getOne(state),
  savingVolunteers: selectors.volunteer.saving(state),
  saveVolunteersError: selectors.volunteer.saveError(state),
  questionnaire: selectors.questionnaire.getOne(state)(questionnaireIdentifiers.VOLUNTEER),
  loading: selectors.questionnaire.loading(state) ||
    selectors.volunteer.loading(state),
  loadError: selectors.questionnaire.loadError(state) ||
    selectors.volunteer.loadError(state),
  volunteerId: ownProps.match.params.volunteerId,
  settings: selectors.settings.getSettings(state)
})

const mapDispatchToProps = dispatch => ({
  loadVolunteer: (id, admin) => dispatch(loadVolunteer(id, admin)),
  saveVolunteer: (volunteer, admin) => dispatch(saveVolunteer(volunteer, admin)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  push: route => dispatch(push(route)),
  submit: form => dispatch(submit(form))
})

class VolunteerEdit extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === ADMIN_ROLE)
  }

  componentWillMount() {
    this.props.loadVolunteer(this.props.volunteerId, this.isAdmin)
    this.props.loadQuestionnaires()
  }

  saveVolunteer = form =>
    this.props.saveVolunteer(fromForm(form), this.isAdmin)

  handleSubmitSuccess = () =>
    this.props.push(this.isAdmin ? '/volunteers/list' : '/volunteers')

  submit = () => this.props.submit(FORM_NAME)

  render() {
    const {
      getVolunteer,
      volunteerId,
      questionnaire,
      loading,
      savingVolunteers
    } = this.props
    const volunteer = getVolunteer(volunteerId)
    const error = this.props.saveVolunteersError || this.props.loadError

    return (
      <Page loading={loading}>
        <PageHeader
          heading={volunteer && volunteer.fullName}
        />
        <PageBody error={error}>
          <form onSubmit={this.saveVolunteer}>
            {volunteer && questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                questionnaire={questionnaire}
                loading={savingVolunteers}
                onSubmit={this.saveVolunteer}
                onSubmitSuccess={this.handleSubmitSuccess}
                initialValues={toForm(volunteer, questionnaire)}
              />
            }
            <div className="text-right">
              <Button
                type="button"
                bsStyle="success"
                onClick={this.submit}
              >Update</Button>
              {' '}
              <Link
                className="btn btn-primary"
                to={this.isAdmin ? '/volunteers/list' : '/volunteers'}
              >Cancel</Link>
            </div>
          </form>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerEdit)
