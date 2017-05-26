import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {toForm, fromForm} from '../../../lib/fields-adapter'
import selectors from '../../../store/selectors'
import {loadCustomer, saveCustomer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {loadFoods} from '../../food/reducers/category'

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
  submit: form => dispatch(submit(form))
})

class CustomerEdit extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = this.props.user.roles.find(r => r === 'admin')
  }

  componentWillMount() {
    this.props.loadCustomer(this.props.customerId, this.isAdmin)
    this.props.loadQuestionnaires()
    this.props.loadFoods()
  }

  componentWillReceiveProps(nextProps) {
    const {savingCustomers, saveCustomersError} = nextProps

    if (!savingCustomers && this.props.savingCustomers && !saveCustomersError) {
      // this.props.push(this.isAdmin ? '/customers' : '/')
    }
  }

  saveCustomer = form =>
    this.props.saveCustomer(fromForm(form), this.isAdmin)

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
                initialValues={toForm(customer, questionnaire)}
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
