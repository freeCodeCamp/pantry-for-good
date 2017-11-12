import React, {Component} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {ButtonToolbar, Button} from 'react-bootstrap'

import {ADMIN_ROLE, questionnaireIdentifiers} from '../../../../common/constants'
import selectors from '../../../store/selectors'
import {loadCustomer, saveCustomer, deleteCustomer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {loadFoods} from '../../food/reducers/category'
import {showConfirmDialog, hideDialog} from '../../core/reducers/dialog'

import {Box, BoxHeader, BoxBody} from '../../../components/box'
import {Page, PageHeader, PageBody} from '../../../components/page'
import {QuestionnaireView} from '../../../components/questionnaire-view'

const mapStateToProps = (state, ownProps) => ({
  user: selectors.auth.getUser(state),
  savingCustomers: selectors.customer.saving(state),
  saveCustomersError: selectors.customer.saveError(state),
  getCustomer: selectors.customer.getOne(state),
  customerId: ownProps.match.params.customerId,
  questionnaire: selectors.questionnaire.getOne(state)(questionnaireIdentifiers.CUSTOMER),
  loading: selectors.questionnaire.loading(state) ||
    selectors.customer.loading(state),
  loadFormDataError: selectors.questionnaire.loadError(state) ||
      selectors.customer.loadError(state)
})

const mapDispatchToProps = dispatch => ({
  loadCustomer: (id, admin) => dispatch(loadCustomer(id, admin)),
  saveCustomer: (customer, admin) => dispatch(saveCustomer(customer, admin)),
  deleteCustomer: id => dispatch(deleteCustomer(id)),
  loadFormData: () => {
    dispatch(loadFoods())
    dispatch(loadQuestionnaires())
  },
  showDialog: (cancel, confirm, message) =>
    dispatch(showConfirmDialog(cancel, confirm, message, 'Delete')),
  hideDialog: () => dispatch(hideDialog()),
  push: route => dispatch(push(route))
})

class CustomerView extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = this.props.user.roles.find(r => r === ADMIN_ROLE)
    this.state = {deleting: false}
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.savingCustomers && !nextProps.savingCustomers && this.state.deleting) {
      this.setState({deleting: false})

      if (!nextProps.saveCustomersError) {
        this.props.push('/customers/list')
      }
    }
  }

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

  confirmDelete = customer => () => this.props.showDialog(
    this.props.hideDialog,
    this.deleteCustomer(customer._id),
    `Customer ${customer.fullName} will be permanently deleted`
  )

  deleteCustomer = id => () => {
    this.setState({deleting: true})
    this.props.deleteCustomer(id)
    this.props.hideDialog()
  }

  render() {
    const {getCustomer, questionnaire, saveCustomersError} = this.props
    const customer = getCustomer(this.props.customerId)
    const loading = this.props.loading || this.props.savingCustomers

    return (
      <Page>
        <PageHeader heading={customer && customer.fullName} />
        <PageBody error={saveCustomersError}>
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
                onClick={this.confirmDelete(customer)}
              >
                Delete
              </Button>
              {' '}
              <Link
                className="btn btn-success"
                to={`/customers/${customer._id}/edit`}
              >
                Edit
              </Link>
              {' '}
              <Link
                className="btn btn-primary"
                to="/customers/list"
              >
                Cancel
              </Link>
            </div> :
            <div className="text-right">
              <Link
                className="btn btn-success"
                to={`/customers/${customer._id}/edit`}
              >
                Edit
              </Link>
              {' '}
              <Link className="btn btn-primary" to="/customers">Cancel</Link>
            </div>
          )}
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerView)
