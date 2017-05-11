import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Table} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {loadCustomers} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import ClientStatusLabel from '../../../components/ClientStatusLabel'
import {Page, PageBody, PageHeader} from '../../../components/page'

const mapStateToProps = state => ({
  customers: selectors.customer.getAll(state),
  loading: selectors.customer.loading(state) ||
    selectors.questionnaire.loading(state),
  loadError: selectors.customer.loadError(state) ||
    selectors.questionnaire.loadError(state)
})

const mapDispatchToProps = dispatch => ({
  loadCustomers: () => dispatch(loadCustomers()),
  loadQuestionnaires: () => dispatch(loadQuestionnaires())
})

class CustomerList extends Component {
  componentWillMount() {
    this.props.loadCustomers()
    this.props.loadQuestionnaires()
  }

  render() {
    const {customers, loading, loadError} = this.props

    return (
      <Page>
        <PageHeader heading="Client Database" />
        <PageBody>
          <Box>
            <BoxHeader heading="Applications" />
            <BoxBody
              loading={loading}
              error={loadError}
            >
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
                  {customers && customers.map(customer =>
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
            </BoxBody>
          </Box>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerList)

function getAddress(client) {
  return client && client.fields.filter(f =>
      f.meta && f.meta.type === 'address')
    .map(f => f.value)
    .join(', ')
}
