import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import set from 'lodash/set'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {fromForm, toForm} from '../../../lib/fields-adapter'
import {selectors} from '../../../store'
import {saveCustomer} from '../customer-reducer'
import {loadFoods} from '../../food/food-category-reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/questionnaire-api'

import {Page, PageHeader, PageBody} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'questionnaireForm'

const mapStateToProps = state => ({
  user: state.auth.user,
  savingCustomers: selectors.savingCustomers(state),
  saveCustomersError: selectors.saveCustomersError(state),
  formData: selectors.getFormData(state, 'qCustomers'),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  settings: state.settings.data,
})

const mapDispatchToProps = dispatch => ({
  saveCustomer: customer => dispatch(saveCustomer(customer)),
  loadFormData: () => {
    dispatch(loadFoods())
    dispatch(loadQuestionnaires())
  },
  submit: form => dispatch(submit(form))
})

class CustomerCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {customerModel: {
      ...this.props.user,
      household: [{
        name: this.props.user.displayName,
        relationship: 'Applicant'
      }],
      foodPreferences: [],
      fields: []
    }}
  }

  isAdmin = this.props.user.roles.find(r => r === 'admin')

  componentWillMount() {
    this.props.loadFormData()
  }

  saveCustomer = fields => {
    this.props.saveCustomer({
      ...this.state.customerModel,
      fields: fromForm(fields)
    }, this.isAdmin)
  }

  handleFieldChange = (field, value) => ev => {
    if (!value) value = ev.target.value
    let items

    if (ev.target.type === 'checkbox')
      items = this.formMethods.toggleCheckbox(this.state.customerModel, field, value)

    const customerModel = set({...this.state.customerModel}, field, items || value)
    this.setState({customerModel})
  }

  isChecked = (field, value) =>
    this.formMethods.isChecked(this.state.customerModel, field, value)

  selectAllFoods = () => {
    const foodPreferences = this.allFoodsSelected() ? [] : [...this.formData.foods]

    this.setState({
      customerModel: {
        ...this.state.customerModel,
        foodPreferences
      }
    })
  }

  allFoodsSelected = () => {
    return this.formData.foods.length === this.state.customerModel.foodPreferences.length
  }

  setDependantList = ev => {
    const newHousehold = this.formMethods.setDependentList(this.state.customerModel,
      ev.target.value)

    this.setState({
      customerModel: {
        ...this.state.customerModel,
        household: newHousehold
      }
    })
  }

  submit = () => this.props.submit(FORM_NAME)

  render() {
    const {settings} = this.props
    const {customerModel} = this.state
    const {foods, questionnaire} = this.props.formData || null

    const error = this.props.loadFormDataError || this.props.saveCustomersError
    const loading = this.props.loadingFormData || this.props.savingCustomers

    return (
      <Page loading={!settings}>
        <PageHeader
          heading="Client Request for Assistance Application"
          showLogo
          center
        >
          {settings &&
            <div className="alert alert-info text-left top-buffer">
              <h4><i className="icon fa fa-warning"></i>Please fill out the following form</h4>
              <p>Once submitted, your application will be reviewed and you will be contacted directly.</p>
              <p>To check on your application status, you may call our client intake line at {settings.clientIntakeNumber.replace(/ /g, "\u00a0")}. For assistance with this application, please contact our support line at {settings.supportNumber.replace(/ /g, "\u00a0")}.</p>
            </div>
          }
        </PageHeader>
        <PageBody>
          <form onSubmit={this.saveCustomer}>
            {customerModel && questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                model={customerModel}
                foods={foods}
                questionnaire={questionnaire}
                loading={loading}
                onSubmit={this.saveCustomer}
                initialValues={toForm(customerModel, questionnaire)}
              />
            }
            <div className="text-right">
              <Button
                type="button"
                onClick={this.submit}
                bsStyle="success"
              >
                Submit
              </Button>
              {' '}
              <Link
                to="/"
                className="btn btn-primary"
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerCreate)
