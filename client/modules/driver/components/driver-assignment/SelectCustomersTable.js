import React from 'react'
import {connect} from 'react-redux'
import {take} from 'lodash'
import {Checkbox, Table} from 'react-bootstrap'

import selectors from '../../../../store/selectors'
import {setFilter, selectCustomers, toggleCustomer} from '../../reducers/assignment'
import {Box, BoxBody, BoxHeader} from '../../../../components/box'
import FilterCustomers from './FilterCustomers'

const mapStateToProps = state => ({
  customers: selectors.delivery.assignment.getFilteredCustomers(state),
  selectedCustomerIds: selectors.delivery.assignment.getSelectedCustomerIds(state),
  drivers: selectors.volunteer.getAllDrivers(state),
  isSelected: selectors.delivery.assignment.isCustomerSelected(state),
  filter: selectors.delivery.assignment.getFilter(state)
})

const mapDispatchToProps = dispatch => ({
  handleSelect: id => () => dispatch(toggleCustomer(id)),
  selectCustomers: customers => dispatch(selectCustomers(customers)),
  handleFilterChange: ev => dispatch(setFilter(ev.target.value))
})

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  allSelected: stateProps.customers.length === stateProps.selectedCustomerIds.length,
  handleSelectAll: () => dispatchProps.selectCustomers(stateProps.customers),
  handleDeselectAll: () => dispatchProps.selectCustomers([])
})

const SelectCustomersTable = ({
  customers,
  isSelected,
  handleSelect,
  allSelected,
  handleSelectAll,
  handleDeselectAll,
  drivers,
  filter,
  handleFilterChange,
  loading,
  error
}) =>
  <Box
    className="assignmentBox"
    style={{
      overflowY: 'overlay'
    }}
  >
    <BoxHeader heading="Customers">
      <div className="box-tools">
        <FilterCustomers
          filter={filter}
          handleFilterChange={handleFilterChange}
          drivers={drivers}
        />
      </div>
    </BoxHeader>
    <BoxBody
      loading={loading}
      error={error}
    >
      <Table responsive striped>
        <thead>
          <tr>
            <th style={{padding: '0 0 0 4px'}}>
              <Checkbox
                checked={allSelected}
                onClick={allSelected ? handleDeselectAll : handleSelectAll}
                style={{marginBottom: '7px'}}
              ><span></span></Checkbox>
            </th>
            <th>#</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer =>
            <tr
              key={customer.id}
              className={isSelected(customer.id) ? 'active' : ''}
              onClick={handleSelect(customer.id)}
              style={{cursor: 'pointer'}}
            >
              <td style={{padding: '0 0 0 4px'}}>
                <Checkbox
                  checked={isSelected(customer.id)}
                  readOnly
                ><span></span></Checkbox>
              </td>
              <td><span>{customer.id}</span></td>
              <td><span>
                {getAddress(customer)}
              </span></td>
            </tr>
          )}
          {!customers.length &&
            <tr>
              <td className="text-center" colSpan="4">No matching customers.</td>
            </tr>
          }
        </tbody>
      </Table>
    </BoxBody>
  </Box>

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SelectCustomersTable)

function getAddress(customer) {
  const fields = customer.fields.filter(field =>
    field.meta && field.meta.type === 'address')
  return take(fields, 2)
    .map(field => field.value)
    .join(', ')
}
