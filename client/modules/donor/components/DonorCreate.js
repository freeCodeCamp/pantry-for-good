import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit, initialize} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {fromForm, toForm} from '../../../lib/fields-adapter'
import userClientRole from '../../../lib/user-client-role'
import selectors from '../../../store/selectors'
import {saveDonor} from '../reducers/donor'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {loadCustomer} from '../../customer/reducer'
import {loadVolunteer} from '../../volunteer/reducer'
import {loadUser} from '../../users/reducer'

import {Page, PageHeader, PageBody} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'
import AssistanceInfo from '../../../components/AssistanceInfo'

const FORM_NAME = 'donorForm'

const mapStateToProps = state => ({
  user: selectors.user.getUser(state),
  savingDonors: selectors.donor.saving(state),
  saveDonorsError: selectors.donor.saveError(state),
  questionnaire: selectors.questionnaire.getOne(state)('qDonors'),
  loading: selectors.questionnaire.loading(state) ||
    selectors.settings.fetching(state),
  loadError: selectors.questionnaire.loadError(state) ||
    selectors.settings.error(state),
  loadingUserData: selectors.customer.loading(state) ||
    selectors.volunteer.loading(state),
  loadingUser: selectors.user.fetching(state),
  settings: selectors.settings.getSettings(state),
  getCustomer: selectors.customer.getOne(state),
  getVolunteer: selectors.volunteer.getOne(state)
})

const mapDispatchToProps = dispatch => ({
  saveDonor: donor => dispatch(saveDonor(donor)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  loadCustomer: id => dispatch(loadCustomer(id)),
  loadVolunteer: id => dispatch(loadVolunteer(id)),
  loadUser: () => dispatch(loadUser()),
  push: route => dispatch(push(route)),
  submit: form => dispatch(submit(form)),
  initialize: (form, values) => dispatch(initialize(form, values, false))
})

class DonorCreate extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.state = {
      donor: {
        ...this.props.user,
        fields: []
      }
    }
  }

  componentWillMount() {
    this.props.loadQuestionnaires()
    const role = userClientRole(this.props.user)
    if (role === 'customer') this.props.loadCustomer(this.props.user._id)
    if (role === 'volunteer') this.props.loadVolunteer(this.props.user._id)
  }

  componentWillReceiveProps(nextProps) {
    const {loadingUserData, getCustomer, getVolunteer, user} = nextProps
    if (this.props.loadingUserData && !loadingUserData) {
      const role = userClientRole(user)
      if (!role) return

      const userData = {
        customer: getCustomer(user._id),
        volunteer: getVolunteer(user._id)
      }

      this.setState({
        donor: {
          ...this.state.donor,
          fields: [...userData[role].fields, ...this.state.donor.fields]
        }
      })
    }

    if (this.props.savingDonors && !nextProps.savingDonors &&
        !nextProps.saveDonorsError) {
      this.props.loadUser()
      this.props.initialize(FORM_NAME, toForm(this.state.donor, this.props.questionnaire))
    }

    if (this.props.loadingUser && !nextProps.loadingUser) {
      this.props.push(this.isAdmin ? '/donors/list' : '/donors')
    }
  }

  saveDonor = form => {
    // this.props.initialize(FORM_NAME, form)
    const donor = fromForm(form)
    this.setState({donor})
    this.props.saveDonor(donor, this.isAdmin)
  }

  submit = () => this.props.submit(FORM_NAME)

  render() {
    const {settings, questionnaire, loading, loadingUser, loadError, savingDonors} = this.props
    const error = loadError || this.props.saveDonorsError

    return (
      <Page loading={loading}>
        <PageHeader
          heading="Donor Profile Creation"
          showLogo
          center
        >
          {settings &&
            <AssistanceInfo settings={settings} />
          }
        </PageHeader>
        <PageBody error={error}>
          <form onSubmit={this.saveDonor}>
            {questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                questionnaire={questionnaire}
                loading={savingDonors || loadingUser}
                onSubmit={this.saveDonor}
                initialValues={toForm(this.state.donor, questionnaire)}
              />
            }
            <div className="text-right">
              <Button
                type="button"
                bsStyle="success"
                onClick={this.submit}
              >
                Submit
              </Button>
              {' '}
              <Link
                className="btn btn-primary"
                to={this.isAdmin ? '/donors/list' : '/'}
              >
                Cancel
              </Link>
            </div>
          </form>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonorCreate)
