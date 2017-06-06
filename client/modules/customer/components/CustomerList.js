import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import selectors from '../../../store/selectors'
import {loadCustomers} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import ClientStatusLabel from '../../../components/ClientStatusLabel'
import {Page, PageBody} from '../../../components/page'

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

  getStatusLabel = (_, customer) => <ClientStatusLabel client={customer} />

  getActionButtons = (_, customer) =>
    <div>
      <Link
        to={`/customers/${customer.id}`}
        className="btn btn-info btn-sm"
      ><i className="fa fa-eye" /></Link>
      {' '}
      <Link
        to={`/customers/${customer.id}/edit`}
        className="btn btn-primary btn-sm"
      ><i className="fa fa-pencil" /></Link>
    </div>

  formatData = () => this.props.customers ?
    this.props.customers.map(c => ({
      ...c,
      address: getAddress(c),
      assignedTo: c.assignedTo && c.assignedTo.fullName
    })) :
    []

  render() {
    const {loading, loadError} = this.props

    return (
      <Page>
        <PageBody>
          <Box>
            <BoxHeader heading="Customers" />
            <BoxBody
              loading={loading}
              error={loadError}
            >
              <BootstrapTable
                data={this.formatData()}
                keyField="id"
                options={{
                  defaultSortName: "id",
                  defaultSortOrder: 'desc',
                  noDataText: loading ? '' : 'No customers found'
                }}
                hover
                striped
                pagination
                search
              >
                <TableHeaderColumn dataField="id" width="70px" dataSort>#</TableHeaderColumn>
                <TableHeaderColumn dataField="fullName" dataSort>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="address">Address</TableHeaderColumn>
                <TableHeaderColumn dataField="email" dataSort>Email</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="householdSummary"
                  width="90px"
                >
                  Household
                </TableHeaderColumn>
                <TableHeaderColumn dataField="assignedTo" dataSort>Driver</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="status"
                  dataFormat={this.getStatusLabel}
                  dataAlign="center"
                  width="90px"
                  dataSort
                >
                  Status
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataFormat={this.getActionButtons}
                  dataAlign="center"
                  width="100px"
                />
              </BootstrapTable>
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
