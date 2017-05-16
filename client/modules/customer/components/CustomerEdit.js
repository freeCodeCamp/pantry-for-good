import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {toForm, fromForm} from '../../../lib/fields-adapter'
import selectors from '../../../store/selectors'
import {loadCustomer, saveCustomer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Page, PageHeader, PageBody} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'questionnaireForm'

const mapStateToProps = (state, ownProps) => ({
  user: selectors.user.getUser(state),
  savingCustomers: selectors.customer.saving(state),
  saveCustomersError: selectors.customer.saveError(state),
  getCustomer: selectors.customer.getOne(state),
  customerId: ownProps.match.params.customerId,
  questionnaire: selectors.questionnaire.getOne(state)('qCustomers'),
  loading: selectors.questionnaire.loading(state) ||
    selectors.customer.loading(state),
  loadError: selectors.questionnaire.loadError(state) ||
    selectors.customer.loadError(state)
})

const mapDispatchToProps = dispatch => ({
  loadCustomer: (id, admin) => dispatch(loadCustomer(id, admin)),
  saveCustomer: (customer, admin) => dispatch(saveCustomer(customer, admin)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
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
    this.props.loadQuestionnaires()
  }

  componentWillReceiveProps(nextProps) {
    const customer = nextProps.getCustomer(nextProps.customerId)
    if (customer && !nextProps.loading && !this.state.customerModel) {
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
    const {questionnaire, loading} = this.props
    const error = this.props.saveCustomersError || this.props.loadError

    return (
      <Page loading={loading}>
        <PageHeader heading={customerModel && customerModel.fullName} />
        <PageBody error={error}>
          <form onSubmit={this.saveCustomer}>
            {customerModel && questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                model={customerModel}
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
