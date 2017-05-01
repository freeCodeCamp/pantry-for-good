import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {toForm, fromForm} from '../../../lib/fields-adapter'
import {selectors} from '../../../store'
import {loadDonor, saveDonor} from '../donor-reducer'
import {loadFoods} from '../../food/food-category-reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/questionnaire-api'

import {Page, PageHeader, PageBody} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'donorForm'

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user,
  savingDonors: selectors.savingDonors(state),
  saveDonorsError: selectors.saveDonorsError(state),
  loadingDonors: selectors.loadingDonors(state),
  loadDonorsError: selectors.loadDonorsError(state),
  getDonor: selectors.getOneDonor(state),
  donorId: ownProps.match.params.donorId,
  formData: selectors.getFormData(state, 'qDonors'),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state)
})

const mapDispatchToProps = dispatch => ({
  loadDonor: (id, admin) => dispatch(loadDonor(id, admin)),
  saveDonor: (donor, admin) => dispatch(saveDonor(donor, admin)),
  loadFormData: () => {
    dispatch(loadFoods())
    dispatch(loadQuestionnaires())
  },
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
    this.props.loadFormData()
  }

  componentWillReceiveProps(nextProps) {
    const {savingDonors, saveDonorsError, formData} = nextProps
    if (!savingDonors && this.props.savingDonors && !saveDonorsError) {
      this.props.push(this.isAdmin ? '/donors' : '/')
    }

    const donor = nextProps.getDonor(nextProps.donorId)
    if (donor && !this.state.donorModel && formData.questionnaire) {
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
    const {foods, questionnaire} = this.props.formData || null

    const error = this.props.loadDonorsError || this.props.saveDonorsError ||
      this.props.loadFormDataError
    const loading = this.props.loadingDonors || this.props.loadingFormData || this.props.savingDonors

    return (
      <Page>
        <PageHeader heading={donorModel && donorModel.fullName} />
        <PageBody error={error}>
          <form onSubmit={this.saveDonor}>
            {donorModel && questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                model={donorModel}
                foods={foods}
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
