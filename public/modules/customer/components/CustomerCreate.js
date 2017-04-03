import React, {Component} from 'react'
import {connect} from 'react-redux'
import {stateGo} from 'redux-ui-router'
import set from 'lodash/set'
import {utc} from 'moment'

import {Form} from '../../common/services/form'
import {selectors} from '../../../store';
import {saveCustomer} from '../../../store/customer';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

import Page from '../../common/components/Page'
import DynamicForm from '../../common/components/DynamicForm'
import Household from './Household'
import FoodbankLogo from '../../common/components/FoodbankLogo'

const mapStateToProps = state => ({
  user: state.auth.user,
  savingCustomers: selectors.savingCustomers(state),
  saveCustomersError: selectors.saveCustomersError(state),
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  settings: state.settings.data,
});

const mapDispatchToProps = dispatch => ({
  saveCustomer: customer => dispatch(saveCustomer(customer)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

class CustomerCreate extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.formMethods = Form.methods
    this.state = {
      customerModel: {},
      customerForm: null,
      error: null,
    }
  }

  componentWillMount() {
    this.props.loadFormData()
  }

  componentWillReceiveProps(nextProps) {
    const {
      savingCustomers,
      saveCustomersError,
      loadingFormData,
      loadFormDataError,
      getCustomer
    } = nextProps

    // Tried to save customer
    if (this.props.savingCustomers && !savingCustomers) {
      this.setState({error: saveCustomersError})
    }

    // Tried to load form data
    if (this.props.loadingFormData && !loadingFormData) {
      if (loadFormDataError) this.setState({error: loadFormDataError})
      else this.formData = nextProps.formData
    }

    if (this.formData && !this.state.customerForm) {
      const customerModel = {
        ...this.props.user,
        household: [{
          name: this.props.user.displayName,
          relationship: 'Applicant'
        }],
        foodPreferences: []
      }

      this.setState({
        customerModel,
        customerForm: Form.methods.generate(customerModel, this.formData, 'qClients')
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
    const {settings} = this.props
    const {customerForm, customerModel} = this.state
    if (!customerModel || !customerForm) return null
    return (
      <div>
      <section className="content-header text-center">
        <FoodbankLogo />
        <h1>Client Request for Assistance Application</h1>
        <div className="alert alert-info text-left top-buffer">
          <h4><i className="icon fa fa-warning"></i>Please fill out the following form</h4>
          Once submitted, your application will be reviewed and you will be contacted directly.
          To check on your application status, you may call our client intake line at {settings.clientIntakeNumber}.
          For assistance with this application, please contact our support line at {settings.supportNumber}.
        </div>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-xs-12">
            <form name="customerForm" onSubmit={this.saveCustomer} noValidate>
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

              {/*<waiver
                customer="$ctrl.customerModel"
                organization="$ctrl.settings.organization"
              ></waiver>*/}
              <div className="row">
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <button type="submit" className="btn btn-success btn-block top-buffer">Submit</button>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <a className="btn btn-primary btn-block top-buffer" href="/#!/">Cancel</a>
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
      </section>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerCreate)
