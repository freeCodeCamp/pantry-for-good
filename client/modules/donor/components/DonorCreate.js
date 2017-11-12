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
import {fromForm, toForm} from '../../../lib/questionnaire-helpers'
import userClientRole from '../../../lib/user-client-role'
import selectors from '../../../store/selectors'
import {saveDonor} from '../reducers/donor'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {loadCustomer} from '../../customer/reducer'
import {loadVolunteer} from '../../volunteer/reducer'
import {loadUser} from '../../users/authReducer'

import {Page, PageHeader, PageBody} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'
import AssistanceInfo from '../../../components/AssistanceInfo'

const FORM_NAME = 'donorForm'

const mapStateToProps = state => ({
  user: selectors.auth.getUser(state),
  savingDonors: selectors.donor.saving(state),
  saveDonorsError: selectors.donor.saveError(state),
  questionnaire: selectors.questionnaire.getOne(state)(questionnaireIdentifiers.DONOR),
  loading: selectors.questionnaire.loading(state) ||
    selectors.settings.fetching(state),
  loadError: selectors.questionnaire.loadError(state) ||
    selectors.settings.error(state),
  loadingUserData: selectors.customer.loading(state) ||
    selectors.volunteer.loading(state),
  loadingUser: selectors.auth.fetching(state),
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
  submit: form => dispatch(submit(form))
})

class DonorCreate extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === ADMIN_ROLE)
    this.state = {
      donor: {
        ...omit(this.props.user, '_id'),
        fields: []
      },
      pendingDonor: {}
    }
  }

  componentWillMount() {
    this.props.loadQuestionnaires()
    const role = userClientRole(this.props.user)
    if (role === clientRoles.CUSTOMER) this.props.loadCustomer(this.props.user._id)
    if (role === clientRoles.VOLUNTEER) this.props.loadVolunteer(this.props.user._id)
  }

  componentWillReceiveProps(nextProps) {
    const {loadingUserData, getCustomer, getVolunteer, user} = nextProps
    if (this.props.loadingUserData && !loadingUserData) {
      const role = userClientRole(user)
      if (!role) return

      const userData = [
        getCustomer(user._id),
        getVolunteer(user._id),
        this.state.donor
      ]

      this.setState({
        donor: {
          ...this.state.donor,
          fields: flatten(userData.filter(x => x).map(data => data.fields))
        }
      })
    }

    if (this.props.savingDonors && !nextProps.savingDonors &&
        !nextProps.saveDonorsError) {
      this.props.loadUser()
      this.setState({donor: this.state.pendingDonor})
    }

    if (this.props.loadingUser && !nextProps.loadingUser) {
      this.props.push(this.isAdmin ? '/donors/list' : '/donors')
    }
  }

  saveDonor = form => {
    const pendingDonor = fromForm(form)
    this.setState({pendingDonor})
    this.props.saveDonor(pendingDonor, this.isAdmin)
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
