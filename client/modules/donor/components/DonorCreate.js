import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {fromForm, toForm} from '../../../lib/fields-adapter'
import {selectors} from '../../../store'
import {saveDonor} from '../donor-reducer'
import {loadFoods} from '../../food/food-category-reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/questionnaire-api'

import {Page, PageHeader, PageBody} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'donorForm'

const mapStateToProps = state => ({
  user: state.auth.user,
  savingDonors: selectors.savingDonors(state),
  saveDonorsError: selectors.saveDonorsError(state),
  formData: selectors.getFormData(state, 'qDonors'),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  settings: state.settings.data,
})

const mapDispatchToProps = dispatch => ({
  saveDonor: donor => dispatch(saveDonor(donor)),
  loadFormData: () => {
    dispatch(loadFoods())
    dispatch(loadQuestionnaires())
  },
  push: route => dispatch(push(route)),
  submit: form => dispatch(submit(form))
})

class DonorCreate extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.state = {
      donorModel: {
        ...this.props.user,
        fields: []
      }
    }
  }

  componentWillMount() {
    this.props.loadFormData()
  }

  componentWillReceiveProps(nextProps) {
    const {savingDonors, saveDonorsError} = nextProps

    if (!savingDonors && this.props.savingDonors && !saveDonorsError) {
      this.props.push(this.isAdmin ? '/donors' : '/')
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
    const {settings} = this.props
    const {donorModel} = this.state
    const {foods, questionnaire} = this.props.formData || null

    const error = this.props.loadFormDataError || this.props.saveDonorsError
    const loading = this.props.loadingFormData || this.props.savingDonors

    return (
      <Page>
        <PageHeader
          heading="Donor Profile Creation"
          showLogo
          center
        >
          {settings &&
            <div className="alert alert-info text-left">
              <i className="icon fa fa-warning"></i>For assistance with this application, please contact our support line at               {settings.supportNumber.replace(/ /g, "\u00a0")}.
            </div>
          }
        </PageHeader>
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
              >Submit</Button>
              {' '}
              <Link className="btn btn-primary" to="/">Cancel</Link>
            </div>
          </form>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonorCreate)
