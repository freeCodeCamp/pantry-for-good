import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {toForm, fromForm} from '../../../lib/fields-adapter'
import userClientRole from '../../../lib/user-client-role'
import selectors from '../../../store/selectors'
import {saveVolunteer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {loadCustomer} from '../../customer/reducer'
import {loadDonor} from '../../donor/reducers/donor'
import {loadUser} from '../../users/reducer'

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
  loadingUserData: selectors.customer.loading(state) || selectors.donor.loading(state),
  loadingUser: selectors.user.fetching(state),
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
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.state = {
      volunteer: {
        ...this.props.user,
        fields: []
      },
      pendingVolunteer: {}
    }
  }

  componentWillMount() {
    this.props.loadQuestionnaires()
    const role = userClientRole(this.props.user)
    if (role === 'donor') this.props.loadDonor(this.props.user._id)
    if (role === 'customer') this.props.loadCustomer(this.props.user._id)
  }

  componentWillReceiveProps(nextProps) {
    const {loadingUserData, getCustomer, getDonor, user} = nextProps
    if (this.props.loadingUserData && !loadingUserData) {
      const role = userClientRole(user)
      if (!role) return

      const userData = {
        customer: getCustomer(user._id),
        donor: getDonor(user._id)
      }

      this.setState({
        volunteer: {
          ...this.state.volunteer,
          fields: [...userData[role].fields, ...this.state.volunteer.fields]
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
