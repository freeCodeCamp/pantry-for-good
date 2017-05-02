import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {toForm, fromForm} from '../../../lib/fields-adapter'
import {selectors} from '../../../store'
import {loadCustomer, saveCustomer} from '../customer-reducer'
import {loadFoods} from '../../food/food-category-reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/questionnaire-api'

import {Page, PageHeader, PageBody} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'questionnaireForm'

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user,
  savingCustomers: selectors.savingCustomers(state),
  saveCustomersError: selectors.saveCustomersError(state),
  loadingCustomers: selectors.loadingCustomers(state),
  loadCustomersError: selectors.loadCustomersError(state),
  getCustomer: selectors.getOneCustomer(state),
  customerId: ownProps.match.params.customerId,
  formData: selectors.getFormData(state, 'qCustomers'),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state)
})

const mapDispatchToProps = dispatch => ({
  loadCustomer: (id, admin) => dispatch(loadCustomer(id, admin)),
  saveCustomer: (customer, admin) => dispatch(saveCustomer(customer, admin)),
  loadFormData: () => {
    dispatch(loadFoods())
    dispatch(loadQuestionnaires())
  },
  submit: form => dispatch(submit(form))
})

class CustomerEdit extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = this.props.user.roles.find(r => r === 'admin')
    this.state = {customerModel: null}
  }

  componentWillMount() {
    this.props.loadCustomer(this.props.customerId, this.isAdmin)
    this.props.loadFormData()
  }

  componentWillReceiveProps(nextProps) {
    const customer = nextProps.getCustomer(nextProps.customerId)
    if (customer && !this.state.customerModel && nextProps.formData.questionnaire) {
      this.setState({
        customerModel: {...customer}
      })
    }
  }

  saveCustomer = fields => {
    if (!this.state.customerModel) return

    this.props.saveCustomer({
      ...this.state.customerModel,
      fields: fromForm(fields)
    }, this.isAdmin)
  }

  submit = () => this.props.submit(FORM_NAME)

  render() {
    const {customerModel} = this.state
    const {foods, questionnaire} = this.props.formData || null

    const error = this.props.loadCustomersError ||
      this.props.saveCustomersError || this.props.loadFormDataError
    const loading = this.props.loadingCustomers || this.props.loadingFormData

    return (
      <Page loading={loading}>
        <PageHeader heading={customerModel && customerModel.fullName} />
        <PageBody error={error}>
          <form onSubmit={this.saveCustomer}>
            {customerModel && questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                model={customerModel}
                foods={foods}
                questionnaire={questionnaire}
                loading={this.props.savingCustomers}
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
                Update
              </Button>
              {' '}
              <Link
                className="btn btn-primary"
                to={this.isAdmin ? '/customers' : '/'}
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerEdit)
