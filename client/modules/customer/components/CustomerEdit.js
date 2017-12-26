import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {ButtonToolbar, Button} from 'react-bootstrap'

import {ADMIN_ROLE, questionnaireIdentifiers} from '../../../../common/constants'
import {toForm, fromForm} from '../../../lib/questionnaire-helpers'
import selectors from '../../../store/selectors'
import {loadCustomer, saveCustomer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {loadFoods} from '../../food/reducers/category'

import {Box, BoxHeader, BoxBody} from '../../../components/box'
import {Page, PageHeader, PageBody} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'questionnaireForm'

const mapStateToProps = (state, ownProps) => ({
  user: selectors.auth.getUser(state),
  savingCustomers: selectors.customer.saving(state),
  saveCustomersError: selectors.customer.saveError(state),
  getCustomer: selectors.customer.getOne(state),
  customerId: ownProps.match.params.customerId,
  questionnaire: selectors.questionnaire.getOne(state)(questionnaireIdentifiers.CUSTOMER),
  foodCategories: selectors.food.category.getAll(state),
  loading: selectors.questionnaire.loading(state) ||
    selectors.customer.loading(state) || selectors.food.category.loading(state),
  loadError: selectors.questionnaire.loadError(state) ||
    selectors.customer.loadError(state) || selectors.food.category.loadError(state)
})

const mapDispatchToProps = dispatch => ({
  loadCustomer: (id, admin) => dispatch(loadCustomer(id, admin)),
  saveCustomer: (customer, admin) => dispatch(saveCustomer(customer, admin)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  loadFoods: () => dispatch(loadFoods()),
  submit: form => dispatch(submit(form)),
  push: to => dispatch(push(to))
})

class CustomerEdit extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = this.props.user.roles.find(r => r === ADMIN_ROLE)
  }

  componentWillMount() {
    this.props.loadCustomer(this.props.customerId, this.isAdmin)
    this.props.loadQuestionnaires()
    this.props.loadFoods()
  }

  saveCustomer = form => {
    return this.props.saveCustomer(fromForm(form), this.isAdmin)
  }

  saveCustomerStatus = status => () => {
    const customer = this.props.getCustomer(this.props.customerId)
    if (!customer) return
    this.props.saveCustomer({
      ...customer,
      status
    }, this.isAdmin)
  }

  handleSubmitSuccess = () =>
    this.props.push(this.isAdmin ? '/customers/list' : '/customers')

  submit = () => this.props.submit(FORM_NAME)

  render() {
    const {
      getCustomer,
      customerId,
      questionnaire,
      foodCategories,
      loading,
      savingCustomers
    } = this.props
    const customer = getCustomer(customerId)
    const error = this.props.saveCustomersError || this.props.loadError

    return (
      <Page loading={loading}>
        <PageHeader heading={customer && customer.fullName} />
        <PageBody error={error}>
          <form onSubmit={this.saveCustomer}>
            {questionnaire && customer && foodCategories && !loading &&
              <Questionnaire
                form={FORM_NAME}
                questionnaire={questionnaire}
                loading={savingCustomers}
                onSubmit={this.saveCustomer}
                onSubmitSuccess={this.handleSubmitSuccess}
                initialValues={toForm(customer, questionnaire)}
              />
            }
            { customer && !loading && customer.status !== "Rejected" &&
            <Box>
              <BoxHeader heading="Status" />
              <BoxBody loading={savingCustomers}>
                <p>
                  You
                  {customer.status === 'Accepted' ? ' will ' : ' won\'t ' }
                  receive deliveries.
                </p>
                { customer.status !== 'Pending' &&
                  <ButtonToolbar>
                    <Button
                      bsStyle="success"
                      active={customer.status === 'Accepted'}
                      disabled={savingCustomers || customer.status === 'Accepted'}
                      onClick={this.saveCustomerStatus('Accepted')}
                    >
                      Available
                    </Button>
                    <Button
                      bsStyle="warning"
                      active={customer.status === 'Inactive'}
                      disabled={savingCustomers || customer.status === 'Inactive'}
                      onClick={this.saveCustomerStatus('Inactive')}
                    >
                      Away
                    </Button>
                  </ButtonToolbar>
                }
              </BoxBody>
            </Box>
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
                to={this.isAdmin ? '/customers/list' : '/customers'}
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
