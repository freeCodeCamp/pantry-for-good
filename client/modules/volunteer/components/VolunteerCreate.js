import React, {Component} from 'react'
import {flatten, omit} from 'lodash'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {
  ADMIN_ROLE,
  clientRoles,
  questionnaireIdentifiers
} from '../../../../common/constants'
import {toForm, fromForm} from '../../../lib/questionnaire-helpers'
import userClientRole from '../../../lib/user-client-role'
import selectors from '../../../store/selectors'
import {saveVolunteer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {loadCustomer} from '../../customer/reducer'
import {loadDonor} from '../../donor/reducers/donor'
import {loadUser} from '../../users/authReducer'

import AssistanceInfo from '../../../components/AssistanceInfo'
import {Page, PageBody, PageHeader} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'volunteerForm'

const mapStateToProps = state => ({
  user: selectors.auth.getUser(state),
  savingVolunteers: selectors.volunteer.saving(state),
  saveVolunteersError: selectors.volunteer.saveError(state),
  questionnaire: selectors.questionnaire.getOne(state)(questionnaireIdentifiers.VOLUNTEER),
  loading: selectors.questionnaire.loading(state),
  loadError: selectors.questionnaire.loadError(state),
  loadingUserData: selectors.customer.loading(state) || selectors.donor.loading(state),
  loadingUser: selectors.auth.fetching(state),
  settings: selectors.settings.getSettings(state),
  getCustomer: selectors.customer.getOne(state),
  getDonor: selectors.donor.getOne(state)
})

const mapDispatchToProps = dispatch => ({
  saveVolunteer: volunteer => dispatch(saveVolunteer(volunteer)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  loadCustomer: id => dispatch(loadCustomer(id)),
  loadDonor: id => dispatch(loadDonor(id)),
  loadUser: () => dispatch(loadUser()),
  push: route => dispatch(push(route)),
  submit: form => dispatch(submit(form))
})

class VolunteerCreate extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === ADMIN_ROLE)
    this.state = {
      volunteer: {
        ...omit(this.props.user, '_id'),
        fields: []
      },
      pendingVolunteer: {}
    }
  }

  componentWillMount() {
    this.props.loadQuestionnaires()
    const role = userClientRole(this.props.user)
    if (role === clientRoles.DONOR) this.props.loadDonor(this.props.user._id)
    if (role === clientRoles.CUSTOMER) this.props.loadCustomer(this.props.user._id)
  }

  componentWillReceiveProps(nextProps) {
    const {loadingUserData, getCustomer, getDonor, user} = nextProps
    if (this.props.loadingUserData && !loadingUserData) {
      const role = userClientRole(user)
      if (!role) return

      const userData = [
        getCustomer(user._id),
        getDonor(user._id),
        this.state.volunteer
      ]

      this.setState({
        volunteer: {
          ...this.state.volunteer,
          fields: flatten(userData.filter(x => x).map(data => data.fields))
        }
      })
    }

    if (this.props.savingVolunteers && !nextProps.savingVolunteers &&
        !nextProps.saveVolunteersError) {
      this.props.loadUser()
      this.setState({volunteer: this.state.pendingVolunteer})
    }

    if (this.props.loadingUser && !nextProps.loadingUser) {
      this.props.push(this.isAdmin ? '/volunteers/list' : '/volunteers')
    }
  }

  saveVolunteer = form => {
    const pendingVolunteer = fromForm(form)
    this.setState({pendingVolunteer})
    this.props.saveVolunteer(pendingVolunteer, this.isAdmin)
  }

  handleSubmitSuccess = () => {
  }

  submit = () => this.props.submit(FORM_NAME)

  render() {
    const {settings, questionnaire, loading, loadingUser, loadError, savingVolunteers} = this.props

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
                loading={savingVolunteers || loadingUser}
                onSubmit={this.saveVolunteer}
                initialValues={toForm(this.state.volunteer, questionnaire)}
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
              <Link
                className="btn btn-primary"
                to={this.isAdmin ? '/volunteers/list' : '/'}
              >Cancel</Link>
            </div>
          </form>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerCreate)
