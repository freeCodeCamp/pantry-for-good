import React from 'react'
import {connect} from 'react-redux'
import {take} from 'lodash'
import {Checkbox, Table} from 'react-bootstrap'

import selectors from '../../../../store/selectors'
import {setFilter, selectCustomers, toggleCustomer} from '../../reducers/assignment'
import {FieldGroup} from '../../../../components/form'

const mapStateToProps = state => ({
  customers: selectors.delivery.assignment.getFilteredCustomers(state),
  selectedCustomerIds: selectors.delivery.assignment.getSelectedCustomerIds(state),
  drivers: selectors.volunteer.getAllDrivers(state),
  isSelected: selectors.delivery.assignment.isCustomerSelected(state),
  filter: selectors.delivery.assignment.getFilter(state),
})

const mapDispatchToProps = dispatch => ({
  handleSelect: id => () => dispatch(toggleCustomer(id)),
  handleFilterChange: ev => dispatch(setFilter(ev.target.value)),
  selectCustomers: customers => dispatch(selectCustomers(customers))
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
  drivers,
  isSelected,
  filter,
  handleSelect,
  handleFilterChange,
  allSelected,
  handleSelectAll,
  handleDeselectAll
}) =>
  <div>
    <FieldGroup
      label="Filter Customers"
      type="select"
      value={filter}
      onChange={handleFilterChange}
    >
      <option value="">All</option>
      <option value="unassigned">Unassigned</option>
      {drivers && drivers.map(driver =>
        <option key={driver.id} value={driver.id}>
          {driver.fullName}
        </option>
      )}
    </FieldGroup>
    <Table responsive striped>
      <thead>
        <tr>
          <th>
            <Checkbox
              checked={allSelected}
              onClick={allSelected ? handleDeselectAll : handleSelectAll}
            />
          </th>
          <th>Customer ID</th>
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
            <td style={{padding: 0}}>
              <Checkbox checked={isSelected(customer.id)} readOnly />
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
  </div>

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SelectCustomersTable)

function getAddress(customer) {
  const fields = customer.fields.filter(field =>
    field.meta && field.meta.type === 'address')
  return take(fields, 2)
    .map(field => field.value)
    .join(', ')
}
