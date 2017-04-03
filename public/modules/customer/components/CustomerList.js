import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Table} from 'react-bootstrap'

import {selectors} from '../../../store';
import {loadCustomers} from '../../../store/customer';

import ClientStatusLabel from '../../common/components/ClientStatusLabel'
import Page from '../../common/components/Page'

const mapStateToProps = state => ({
  customers: selectors.getAllCustomers(state),
  loadingCustomers: selectors.loadingCustomers(state),
  loadCustomersError: selectors.loadCustomersError(state)
});

const mapDispatchToProps = dispatch => ({
  loadCustomers: () => dispatch(loadCustomers())
});

class CustomerList extends Component {
  componentWillMount() {
    if (!this.props.loadingCustomers && !this.props.loadCustomersError)
      this.props.loadCustomers()
  }
  render() {
    const {customers, loadCustomersError} = this.props
    return (
      <Page heading="Client Database">
        <div className="row">
          <div className="col-xs-12">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Applications</h3>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Full Address</th>
                    <th>Telephone Number</th>
                    <th>Email</th>
                    <th>Delivery Instructions</th>
                    <th>Household</th>
                    <th>Assigned Driver</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers && customers.map(customer =>
                    <tr key={customer.id}>
                      <td><span>{customer.id}</span></td>
                      <td><span>{customer.fullName}</span></td>
                      <td><span>{customer.fullAddress}</span></td>
                      <td><span>{customer.telephoneNumber}</span></td>
                      <td><span>{customer.email}</span></td>
                      <td><span>{customer.deliveryInstructions}</span></td>
                      <td><span>{customer.householdSummary}</span></td>
                      <td><span>{customer.assignedTo && customer.assignedTo.fullName}</span></td>
                      <td><ClientStatusLabel client={customer} /></td>
                      <td>
                        <a
                          href={`/#!/admin/customers/${customer.id}`}
                          className="btn btn-info btn-flat btn-xs"
                        ><i className="fa fa-eye"></i> View</a>
                        <a
                          href={`/#!/admin/customers/${customer.id}/edit`}
                          className="btn btn-primary btn-flat btn-xs"
                        ><i className="fa fa-pencil"></i> Edit</a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        {loadCustomersError &&
          <div className="text-danger">
            <strong>{loadCustomersError}</strong>
          </div>
        }
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerList)
