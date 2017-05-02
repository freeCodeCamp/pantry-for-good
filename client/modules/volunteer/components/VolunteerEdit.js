import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {Button, Col, Row} from 'react-bootstrap'

import {toForm, fromForm} from '../../../lib/fields-adapter'
import {selectors} from '../../../store'
import {loadVolunteer, saveVolunteer} from '../volunteer-reducer'
import {loadFoods} from '../../food/food-category-reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/questionnaire-api'

import {Page, PageBody, PageHeader} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'volunteerForm'

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user,
  getVolunteer: selectors.getOneVolunteer(state),
  loadingVolunteer: selectors.loadingVolunteers(state),
  loadVolunteerError: selectors.loadVolunteersError(state),
  savingVolunteers: selectors.savingVolunteers(state),
  saveVolunteersError: selectors.saveVolunteersError(state),
  formData: selectors.getFormData(state, 'qVolunteers'),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  volunteerId: ownProps.match.params.volunteerId,
  settings: state.settings.data
})

const mapDispatchToProps = dispatch => ({
  loadVolunteer: (id, admin) => dispatch(loadVolunteer(id, admin)),
  saveVolunteer: (volunteer, admin) => dispatch(saveVolunteer(volunteer, admin)),
  loadFormData: () => {
    dispatch(loadFoods())
    dispatch(loadQuestionnaires())
  },
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
    this.props.loadFormData()
  }

  componentWillReceiveProps(nextProps) {
    const {
      savingVolunteers,
      saveVolunteersError,
      formData
    } = nextProps

    if (!savingVolunteers && this.props.savingVolunteers && !saveVolunteersError) {
      this.props.push(this.isAdmin ? '/volunteers' : '/')
    }

    const volunteer = nextProps.getVolunteer(nextProps.volunteerId)
    if (volunteer && !this.state.volunteerModel && formData.questionnaire) {
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
    const {foods, questionnaire} = this.props.formData || null

    const error = this.props.loadVolunteerError || this.props.saveVolunteerError || this.props.loadFormDataError
    const loading = this.props.loadingVolunteers || this.props.savingVolunteers || this.props.loadingFormData

    return (
      <Page>
        <PageHeader
          heading={volunteerModel && volunteerModel.fullName}
        />
        <PageBody error={error}>
          <form onSubmit={this.saveVolunteer}>
            {volunteerModel && questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                model={volunteerModel}
                foods={foods}
                questionnaire={questionnaire}
                loading={loading}
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
