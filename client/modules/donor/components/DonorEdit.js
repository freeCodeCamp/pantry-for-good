import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {ADMIN_ROLE, questionnaireIdentifiers} from '../../../../common/constants'
import {toForm, fromForm} from '../../../lib/questionnaire-helpers'
import selectors from '../../../store/selectors'
import {loadDonor, saveDonor} from '../reducers/donor'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Page, PageHeader, PageBody} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'donorForm'

const mapStateToProps = (state, ownProps) => ({
  user: selectors.auth.getUser(state),
  savingDonors: selectors.donor.saving(state),
  saveDonorsError: selectors.donor.saveError(state),
  getDonor: selectors.donor.getOne(state),
  donorId: ownProps.match.params.donorId,
  questionnaire: selectors.questionnaire.getOne(state)(questionnaireIdentifiers.DONOR),
  loading: selectors.questionnaire.loading(state) ||
    selectors.donor.loading(state),
  loadFormDataError: selectors.questionnaire.loadError(state) ||
    selectors.donor.loadError(state)
})

const mapDispatchToProps = dispatch => ({
  loadDonor: (id, admin) => dispatch(loadDonor(id, admin)),
  saveDonor: (donor, admin) => dispatch(saveDonor(donor, admin)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  push: route => dispatch(push(route)),
  submit: form => dispatch(submit(form))
})

class DonorEdit extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === ADMIN_ROLE)
  }

  componentWillMount() {
    this.props.loadDonor(this.props.donorId, this.isAdmin)
    this.props.loadQuestionnaires()
  }

  saveDonor = form =>
    this.props.saveDonor(fromForm(form), this.isAdmin)

  handleSubmitSuccess = () =>
    this.props.push(this.isAdmin ? '/donors/list' : '/donors')

  submit = () => this.props.submit(FORM_NAME)

  render() {
    // eslint-disable-next-line no-unused-vars
    const {getDonor, donorId, questionnaire, loading, savingDonors} = this.props
    const donor = getDonor(donorId)
    const error = this.props.loadError || this.props.saveDonorsError

    return (
      <Page>
        <PageHeader heading={donor && donor.fullName} />
        <PageBody error={error}>
          <form onSubmit={this.saveDonor}>
            {donor && questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                questionnaire={questionnaire}
                loading={savingDonors}
                onSubmit={this.saveDonor}
                onSubmitSuccess={this.handleSubmitSuccess}
                initialValues={toForm(donor, questionnaire)}
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
                to={this.isAdmin ? '/donors/list' : '/donors'}
              >Cancel</Link>
            </div>
          </form>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonorEdit)
