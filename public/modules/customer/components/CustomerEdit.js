import React, {Component} from 'react'
import {connect} from 'react-redux'
import {stateGo} from 'redux-ui-router'
import set from 'lodash/set'
import {utc} from 'moment'

import {Form} from '../../common/services/form'
import {selectors} from '../../../store';
import {loadCustomer, saveCustomer} from '../../../store/customer';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

import Page from '../../common/components/Page'
import DynamicForm from '../../common/components/DynamicForm'
import Household from './Household'

const mapStateToProps = state => ({
  user: state.auth.user,
  savingCustomers: selectors.savingCustomers(state),
  saveCustomersError: selectors.saveCustomersError(state),
  loadingCustomers: selectors.loadingCustomers(state),
  loadCustomersError: selectors.loadCustomersError(state),
  getCustomer: selectors.getOneCustomer(state),
  customerId: state.router.currentParams.customerId,
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state)
});

const mapDispatchToProps = dispatch => ({
  loadCustomer: (id, admin) => dispatch(loadCustomer(id, admin)),
  saveCustomer: (customer, admin) => dispatch(saveCustomer(customer, admin)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

class CustomerEdit extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.formMethods = Form.methods
    this.state = {
      customerModel: null,
      customerForm: null,
      error: null,
    }
  }

  componentWillMount() {
    this.props.loadCustomer(this.props.customerId, this.isAdmin)
    this.props.loadFormData()
  }

  componentWillReceiveProps(nextProps) {
    const {
      savingCustomers,
      saveCustomersError,
      loadingCustomers,
      loadCustomersError,
      loadingFormData,
      loadFormDataError,
      getCustomer
    } = nextProps

    // Tried to save customer
    if (this.props.savingCustomers && !savingCustomers) {
      this.setState({error: saveCustomersError})
    }

    // Tried to load customer
    if (this.props.loadingCustomers && !loadingCustomers) {
      this.setState({error: loadCustomersError})
    }

    // Tried to load form data
    if (this.props.loadingFormData && !loadingFormData) {
      if (loadFormDataError) this.setState({error: loadFormDataError})
      else this.formData = nextProps.formData
    }

    const customer = getCustomer(nextProps.customerId)
    if (customer && this.formData && !this.state.customerForm) {
      this.setState({
        customerModel: {
          ...customer,
          dateOfBirth: utc(customer.dateOfBirth).format('YYYY-MM-DD'),
          household: [
            ...customer.household.map(dependant => ({
              ...dependant,
              dateOfBirth: utc(dependant.dateOfBirth).format('YY-MM-DD')
            }))
          ]
        },
        customerForm: Form.methods.generate(customer, this.formData, 'qClients')
      })
    }
  }

  saveCustomer = ev => {
    ev.preventDefault()
    if (!this.state.customerModel) return
    this.props.saveCustomer(this.state.customerModel, this.isAdmin)
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

  selectAllFoods = ev => {
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

  render() {
    const {customerForm, customerModel} = this.state
    if (!customerModel || !customerForm) return null
    return (
      <Page heading={customerModel.fullName}>
        <div className="row">
          <div className="col-xs-12">
            {/*maybe get a ref to form and use checkValidity before saving*/}
            <form name="dynTypeForm" onSubmit={this.saveCustomer}>
              <DynamicForm
                sectionNames={customerForm.sectionNames}
                dynForm={customerForm.dynForm}
                dynType={customerModel}
                foodList={customerForm.foodList}
                handleFieldChange={this.handleFieldChange}
                isChecked={this.isChecked}
                selectAllFoods={this.selectAllFoods}
                allFoodsSelected={this.allFoodsSelected}
              />
              <Household
                numberOfDependants={customerModel.household.length}
                dependants={customerModel.household}
                setDependantList={this.setDependantList}
                handleFieldChange={this.handleFieldChange}
              />
              <div className="row">
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <button type="submit" className="btn btn-success btn-block top-buffer">Update</button>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <a
                    className="btn btn-primary btn-block top-buffer"
                    href={this.isAdmin ? '/#!/admin/customers' : '/#!/'}
                  >
                    Cancel
                  </a>
                </div>
              </div>
              {this.state.error &&
                <div className="text-danger">
                  <strong>{this.state.error}</strong>
                </div>
              }
            </form>
          </div>
        </div>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerEdit)
