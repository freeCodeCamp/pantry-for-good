import React, {Component} from 'react'
import {connect} from 'react-redux'
import {sortBy} from 'lodash'
import {Link} from 'react-router-dom'
import {Table} from 'react-bootstrap'

import {selectors} from '../../../store'
import {loadCustomers} from '../customer-reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/questionnaire-api'

import ClientStatusLabel from '../../../components/ClientStatusLabel'
import Page from '../../../components/page/PageBody'

const mapStateToProps = state => ({
  customers: selectors.getAllCustomers(state),
  loadingCustomers: selectors.loadingCustomers(state),
  loadCustomersError: selectors.loadCustomersError(state),
  questionnaire: selectors.getOneQuestionnaire(state, 'qCustomers')
})

const mapDispatchToProps = dispatch => ({
  loadCustomers: () => dispatch(loadCustomers()),
  loadQuestionnaires: () => dispatch(loadQuestionnaires())
})

class CustomerList extends Component {
  componentWillMount() {
    if (!this.props.loadingCustomers && !this.props.loadCustomersError) {
      this.props.loadCustomers()
      this.props.loadQuestionnaires()
    }
  }
  render() {
    const {customers, loadCustomersError, questionnaire} = this.props
    if (!questionnaire) return null

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
                    <th>Name</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>Household</th>
                    <th>Assigned Driver</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers && questionnaire && customers.map(customer =>
                    <tr key={customer.id}>
                      <td><span>{customer.id}</span></td>
                      <td><span>{customer.fullName}</span></td>
                      <td><span>{getAddress(customer)}</span></td>
                      <td><span>{customer.email}</span></td>
                      <td><span>{customer.householdSummary}</span></td>
                      <td><span>{customer.assignedTo && customer.assignedTo.fullName}</span></td>
                      <td><ClientStatusLabel client={customer} /></td>
                      <td>
                        <Link
                          to={`/customers/${customer.id}`}
                          className="btn btn-info btn-flat btn-xs"
                        ><i className="fa fa-eye"></i> View</Link>
                        <Link
                          to={`/customers/${customer.id}/edit`}
                          className="btn btn-primary btn-flat btn-xs"
                        ><i className="fa fa-pencil"></i> Edit</Link>
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

function getAddress(client) {
  return client && sortBy(client.fields.filter(f =>
      f.meta && f.meta.type === 'address'), 'position')
    .map(f => f.value)
    .join(', ')
}
