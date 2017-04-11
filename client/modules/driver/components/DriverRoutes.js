import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Table} from 'react-bootstrap'
import get from 'lodash/get'

import {selectors} from '../../../store'
import {loadCustomers, assignCustomers} from '../../customer/customer-reducer'
import {loadVolunteers} from '../../volunteer/volunteer-reducer'

import Page from '../../../components/page/PageBody'

const mapStateToProps = state => ({
  customers: selectors.getAllCustomers(state),
  drivers: selectors.getAllVolunteers(state).filter(vol =>
    vol.driver && vol.status === 'Active'),
  loadingCustomers: selectors.loadingCustomers(state),
  savingCustomers: selectors.savingCustomers(state),
  loading: selectors.loadingVolunteers(state) || selectors.loadingCustomers(state),
  error: selectors.loadCustomersError(state) || selectors.loadVolunteersError(state)
})

const mapDispatchToProps = dispatch => ({
  loadCustomers : () => dispatch(loadCustomers()),
  loadVolunteers: () => dispatch(loadVolunteers()),
  assignCustomers: (customerIds, driverId) => dispatch(assignCustomers(customerIds, driverId))
})

class DriverRoutes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCustomers: [],
      selectedDriver: null
    }
  }
  componentWillMount() {
    this.props.loadCustomers()
    this.props.loadVolunteers()
  }

  handleDriverChange = ev => {
    this.setState({selectedDriver: ev.target.value})
  }

  handleSelectCustomer = customer => () => {
    if (this.isSelected(customer)) {
      this.setState({
        selectedCustomers: this.state.selectedCustomers.filter(id => id !== customer.id)
      })
    } else {
      this.setState({
        selectedCustomers: [...this.state.selectedCustomers, customer.id]
      })
    }
  }

  isSelected = customer =>
    !!this.state.selectedCustomers.find(id => id === customer.id)

  assignCustomers = ev => {
    ev.preventDefault()
    const customerIds = this.props.customers.filter(this.isSelected)
      .map(customer => customer.id)

    if (!customerIds.length) return
    this.props.assignCustomers(customerIds, this.state.selectedDriver)
  }

  render() {
    const {customers, drivers, loading, saving, error} = this.props
    const {selectedCustomers, selectedDriver} = this.state
    return (
      <Page heading="Route Assignment">
        <div className="row">
          <div className="col-md-6">
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">Clients</h3>
              </div>
              <div className="box-body table-responsive no-padding">
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Assigned To</th>
                      <th>Client ID</th>
                      <th>Full Address</th>
                      <th>Delivery Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers && customers.map((customer, i) =>
                      <tr
                        key={i}
                        className={this.isSelected(customer) ? 'active' : ''}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={this.isSelected(customer)}
                            onChange={this.handleSelectCustomer(customer)}
                          />
                        </td>
                        <td><span>{get(customer, 'assignedTo.fullName')}</span></td>
                        <td><span>{customer.id}</span></td>
                        <td><span>{customer.fullAddress}</span></td>
                        <td><span>{customer.deliveryInstructions}</span></td>
                      </tr>
                    )}
                    {!customers &&
                      <tr>
                        <td className="text-center" colSpan="4">There are no clients to be assigned.</td>
                      </tr>
                    }
                  </tbody>
                </Table>
              </div>
              <div className="box-footer">
                <form name="assignForm" onSubmit={this.assignCustomers}>
                  <div className="input-group">
                    <select
                      className="form-control"
                      value={selectedDriver || ''}
                      onChange={this.handleDriverChange}
                      required
                    >
                      <option value="">Select driver</option>
                      {drivers && drivers.map((driver, i) =>
                        <option
                          key={i}
                          value={driver.id}
                        >
                          {driver.fullName}
                        </option>
                      )}
                    </select>
                      <span className="input-group-btn">
                        <button
                          className="btn btn-success btn-flat"
                          type="submit"
                          disabled={!selectedCustomers.length || !selectedDriver}
                        >
                          {/*data-ng-disabled="$ctrl.isDisabled(assignForm)"*/}
                          Assign
                        </button>
                      </span>
                  </div>
                </form>
              </div>
              {loading || saving &&
                <div className="overlay">
                  <i className="fa fa-refresh fa-spin"></i>
                </div>
              }
            </div>
          </div>
          <div className="col-md-6">
            <div className="box box-primary">
              <div className="box-header">
                <h3 className="box-title">Google Maps</h3>
              </div>
              <div className="box-body no-padding">
                <div className="googleMap"></div>
                {/*<!-- /.Google map -->*/}
              </div>
              {loading &&
                <div className="overlay">
                  <i className="fa fa-refresh fa-spin"></i>
                </div>
              }
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverRoutes)
