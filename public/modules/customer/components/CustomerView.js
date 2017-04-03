import React, {Component} from 'react'
import {connect} from 'react-redux'
import {stateGo} from 'redux-ui-router';
import moment from 'moment'
import {Table} from 'react-bootstrap'

import {View} from '../../core/services/view.client.service'
// import {View} from '../../common/services/view'
import {selectors} from '../../../store';
import {loadCustomer, saveCustomer, deleteCustomer} from '../../../store/customer';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

import DynamicView from '../../common/components/DynamicView'
import Page from '../../common/components/Page'

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
  deleteCustomer: id => dispatch(deleteCustomer(id)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

class CustomerView extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.state = {
      customerModel: null,
      customerView: null,
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

    // generate customer view
    const customer = getCustomer(nextProps.customerId)
    if (customer && this.formData && !this.state.customerView) {
      const customerModel = {
        ...customer,
        foodPreferences: this.getFoodPreferences(customer)
      }

      this.setState({
        customerModel,
        customerView: View.methods.generate(customerModel, this.formData, 'qClients')
      })
    }
  }

  saveCustomer = status => () => {
    if (!this.state.customerModel) return
    this.props.saveCustomer({
      ...this.state.customerModel,
      status
    }, this.isAdmin)
  }

  deleteCustomer = customer => () => this.props.deleteCustomer(customer.id)

  getFoodPreferences = customer => {
    const {foodPreferences, foodPreferencesOther} = customer;
    if (Array.isArray(foodPreferences) && foodPreferences.length > 0) {
      console.log('foodPreferences', foodPreferences)
      return `${foodPreferences.filter(item => item && item.name).map(item => item.name).join(', ')}
              ${foodPreferencesOther ? ', ' + foodPreferencesOther : ''}`;
    } else {
      return foodPreferencesOther;
    }
  };

  // Add up totals in Financial Assessment
  total = (data, type) =>
    data && data.reduce((a, b) => a + b[type], 0);

  render() {
    const {customerModel, customerView, error} = this.state
    if (!customerModel || !customerView) return null
    return (
      <Page heading={customerModel.fullName}>
        <div className="row">
          <div className="col-xs-12">
            <DynamicView
              dynForm={customerView.dynForm}
              sectionNames={customerView.sectionNames}
            />
            <div className="box box-solid box-primary">
              <div className="box-header">
                <h3 className="box-title">SECTION E - DEPENDANTS AND PEOPLE IN HOUSEHOLD</h3>
              </div>
              <div className="box-body">
                <table className="table-striped table-bordered table-hover table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Relationship</th>
                      <th>Date of Birth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerModel.household.map((dependant, i) =>
                      <tr key={i}>
                        <td>{dependant.name}</td>
                        <td>{dependant.relationship}</td>
                        <td>{moment(dependant.dateOfBirth).format('YYYY-MM-DD')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {this.isAdmin ?
              <div className="form-group">
                <a
                  className="btn btn-success"
                  onClick={this.saveCustomer('Accepted')}
                >
                  Accept
                </a>
                <a
                  className="btn btn-danger"
                  onClick={this.saveCustomer('Rejected')}
                >
                  Reject
                </a>
                <a
                  className="btn btn-warning"
                  onClick={this.saveCustomer('Inactive')}
                >
                  Inactive
                </a>
                <a
                  className="btn btn-warning"
                  onClick={this.deleteCustomer(customerModel)}
                >
                  Delete
                </a>
                <a
                  className="btn btn-primary"
                  href={`/#!/admin/customers/${customerModel.id}/edit`}
                >
                  Edit
                </a>
                <a
                  className="btn btn-primary"
                  href="/#!/admin/customers"
                >
                  Cancel
                </a>
              </div> :
              <div className="form-group">
                <a
                  className="btn btn-primary"
                  href={`/#!/customer/${customerModel.id}/edit`}
                >
                  Edit
                </a>
                <a className="btn btn-primary" href="/#!/">Cancel</a>
              </div>
            }
          </div>
        </div>
        {error &&
          <div className="text-danger">
            <strong>{error}</strong>
          </div>
        }
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerView)
