import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {ButtonToolbar, Button} from 'react-bootstrap'

import {selectors} from '../../../store'
import {loadCustomer, saveCustomer, deleteCustomer} from '../customer-reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/questionnaire-api'
import {loadFoods} from '../../food/food-category-reducer'

import {Box, BoxHeader, BoxBody} from '../../../components/box'
import {Page, PageHeader, PageBody} from '../../../components/page'
import {QuestionnaireView} from '../../../components/questionnaire-view'

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
  deleteCustomer: id => dispatch(deleteCustomer(id)),
  loadFormData: () => {
    dispatch(loadFoods())
    dispatch(loadQuestionnaires())
  }
})

class CustomerView extends Component {
  isAdmin = this.props.user.roles.find(r => r === 'admin')

  componentWillMount() {
    this.props.loadCustomer(this.props.customerId, this.isAdmin)
    this.props.loadFormData()
  }

  saveCustomer = status => () => {
    const customer = this.props.getCustomer(this.props.customerId)
    if (!customer) return

    this.props.saveCustomer({
      ...customer,
      status
    }, this.isAdmin)
  }

  deleteCustomer = customer => () => this.props.deleteCustomer(customer.id)

  // Add up totals in Financial Assessment
  total = (data, type) =>
    data && data.reduce((a, b) => a + b[type], 0);

  render() {
    const customer = this.props.getCustomer(this.props.customerId)
    const questionnaire = this.props.formData.questionnaire
    const loading = this.props.loadingCustomers || this.props.loadingFormData || this.props.savingCustomers

    return (
      <Page>
        <PageHeader heading={customer && customer.fullName} />
        <PageBody>
          {customer && questionnaire &&
            <QuestionnaireView
              model={customer}
              questionnaire={questionnaire}
              loading={loading}
            />
          }

          {customer && this.isAdmin &&
            <Box>
              <BoxHeader heading={`Status: ${customer.status}`} />
              <BoxBody loading={loading}>
                <ButtonToolbar>
                  <Button
                    bsStyle="success"
                    active={customer.status === 'Accepted'}
                    disabled={loading || customer.status === 'Accepted'}
                    onClick={this.saveCustomer('Accepted')}
                  >
                    Accept
                  </Button>
                  <Button
                    bsStyle="danger"
                    active={customer.status === 'Rejected'}
                    disabled={loading || customer.status === 'Rejected'}
                    onClick={this.saveCustomer('Rejected')}
                  >
                    Reject
                  </Button>
                  <Button
                    bsStyle="warning"
                    active={customer.status === 'Inactive'}
                    disabled={loading || customer.status === 'Inactive'}
                    onClick={this.saveCustomer('Inactive')}
                  >
                    Inactive
                  </Button>
                </ButtonToolbar>
              </BoxBody>
            </Box>
          }
          {customer && (this.isAdmin ?
            <div className="text-right">
              <Button
                bsStyle="danger"
                onClick={this.deleteCustomer(customer)}
              >
                Delete
              </Button>
              {' '}
              <Link
                className="btn btn-success"
                to={`/customers/${customer.id}/edit`}
              >
                Edit
              </Link>
              {' '}
              <Link
                className="btn btn-primary"
                to="/customers"
              >
                Cancel
              </Link>
            </div> :
            <div className="text-right">
              <Link
                className="btn btn-success"
                to={`/customer/${customer.id}/edit`}
              >
                Edit
              </Link>
              {' '}
              <Link className="btn btn-primary" to="/">Cancel</Link>
            </div>
          )}
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerView)
