import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {toForm, fromForm} from '../../../lib/fields-adapter'
import selectors from '../../../store/selectors'
import {loadDonor, saveDonor} from '../reducers/donor'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Page, PageHeader, PageBody} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'donorForm'

const mapStateToProps = (state, ownProps) => ({
  user: selectors.user.getUser(state),
  savingDonors: selectors.donor.saving(state),
  saveDonorsError: selectors.donor.saveError(state),
  getDonor: selectors.donor.getOne(state),
  donorId: ownProps.match.params.donorId,
  questionnaire: selectors.questionnaire.getOne(state)('qDonors'),
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
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.state = {donorModel: null}
  }

  componentWillMount() {
    this.props.loadDonor(this.props.donorId, this.isAdmin)
    this.props.loadQuestionnaires()
  }

  componentWillReceiveProps(nextProps) {
    const {getDonor, questionnaire, savingDonors, saveDonorsError} = nextProps
    if (!savingDonors && this.props.savingDonors && !saveDonorsError) {
      this.props.push(this.isAdmin ? '/donors' : '/')
    }

    const donor = getDonor(nextProps.donorId)
    if (donor && !this.state.donorModel && questionnaire) {
      this.setState({
        donorModel: {...donor}
      })
    }
  }

  saveDonor = fields => {
    if (!this.state.donorModel) return
    this.props.saveDonor({
      ...this.state.donorModel,
      fields: fromForm(fields)
    }, this.isAdmin)
  }

  submit = () => this.props.submit(FORM_NAME)

  render() {
    const {donorModel} = this.state
    const {questionnaire, loading} = this.props
    const error = this.props.loadError || this.props.saveDonorsError

    return (
      <Page>
        <PageHeader heading={donorModel && donorModel.fullName} />
        <PageBody error={error}>
          <form onSubmit={this.saveDonor}>
            {donorModel && questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                model={donorModel}
                questionnaire={questionnaire}
                loading={loading}
                onSubmit={this.saveDonor}
                initialValues={toForm(donorModel, questionnaire)}
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
                to={this.isAdmin ? '/donors' : '/'}
              >Cancel</Link>
            </div>
          </form>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonorEdit)
