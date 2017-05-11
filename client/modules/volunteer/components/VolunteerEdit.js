import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {Button, Col, Row} from 'react-bootstrap'

import {toForm, fromForm} from '../../../lib/fields-adapter'
import selectors from '../../../store/selectors'
import {loadVolunteer, saveVolunteer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Page, PageBody, PageHeader} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'volunteerForm'

const mapStateToProps = (state, ownProps) => ({
  user: selectors.user.getUser(state),
  getVolunteer: selectors.volunteer.getOne(state),
  savingVolunteers: selectors.volunteer.saving(state),
  saveVolunteersError: selectors.volunteer.saveError(state),
  questionnaire: selectors.questionnaire.getOne(state)('qVolunteers'),
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
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.state = {volunteerModel: null}
  }

  componentWillMount() {
    this.props.loadVolunteer(this.props.volunteerId, this.isAdmin)
    this.props.loadQuestionnaires()
  }

  componentWillReceiveProps(nextProps) {
    const {
      questionnaire,
      getVolunteer,
      savingVolunteers,
      saveVolunteersError,
    } = nextProps

    if (!savingVolunteers && this.props.savingVolunteers && !saveVolunteersError) {
      this.props.push(this.isAdmin ? '/volunteers' : '/')
    }

    const volunteer = getVolunteer(nextProps.volunteerId)
    if (volunteer && !this.state.volunteerModel && questionnaire) {
      this.setState({
        volunteerModel: {...volunteer}
      })
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

  render() {
    const {volunteerModel} = this.state
    const {questionnaire, loadError, saveVolunteersError, loading, savingVolunteers} = this.props

    return (
      <Page>
        <PageHeader
          heading={volunteerModel && volunteerModel.fullName}
        />
        <PageBody error={loadError || saveVolunteersError}>
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
            <div className="text-right">
              <Button
                type="button"
                bsStyle="success"
                onClick={this.submit}
              >Update</Button>
              {' '}
              <Link
                className="btn btn-primary"
                to={this.isAdmin ? "/volunteers" : "/"}
              >Cancel</Link>
            </div>
          </form>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerEdit)
