import React from 'react'
import {connect} from 'react-redux'
import {Table} from 'react-bootstrap'
import {Checkbox} from '../../../../components/form'

import selectors from '../../../../store/selectors'
import getAddress from '../../../../lib/get-address'
import {setFilter, selectCustomers, toggleCustomer} from '../../reducers/assignment'
import {addWaypoints, removeWaypoints} from '../../reducers/route'
import FilterCustomers from './FilterCustomers'

const mapStateToProps = state => ({
  customers: selectors.delivery.assignment.getFilteredCustomers(state),
  getCustomer: selectors.customer.getOne(state),
  selectedCustomerIds: selectors.delivery.assignment.getSelectedCustomerIds(state),
  drivers: selectors.volunteer.getAllDrivers(state),
  isSelected: selectors.delivery.assignment.isCustomerSelected(state),
  filter: selectors.delivery.assignment.getFilter(state),
  waypoints: selectors.delivery.route.getAllWaypoints(state)
})

const mapDispatchToProps = dispatch => ({
  handleSelect: id => dispatch(toggleCustomer(id)),
  selectCustomers: customers => dispatch(selectCustomers(customers)),
  handleFilterChange: ev => dispatch(setFilter(ev.target.value)),
  addWaypoints: waypoints => dispatch(addWaypoints(waypoints)),
  removeWaypoints: waypoints => dispatch(removeWaypoints(waypoints))
})

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  allSelected: stateProps.customers.length === stateProps.selectedCustomerIds.length,
  handleSelectAll: () => {
    dispatchProps.selectCustomers(stateProps.customers)
    dispatchProps.addWaypoints(stateProps.customers)
  },
  handleDeselectAll: () => {
    dispatchProps.selectCustomers([]) // TODO: deselect only visible selected customers
    dispatchProps.setWaypoints([]) //removeWaypoints(stateProps.customers)
  },
  handleSelect: id => () => {
    const customer = stateProps.getCustomer(id)
    dispatchProps.handleSelect(id)
    if (stateProps.selectedCustomerIds.find(selectedId => selectedId === id)) {
      dispatchProps.removeWaypoints([customer])
    } else {
      dispatchProps.addWaypoints([customer])
    }
  }
})

const CustomerSelector = ({
  customers,
  isSelected,
  handleSelect,
  allSelected,
  handleSelectAll,
  handleDeselectAll,
  drivers,
  filter,
  handleFilterChange
}) =>
  <div className="customerSelector">
    <div style={{display: 'flex'}}>
      <label style={{marginRight: '40px'}}>Customers Assigned To:</label>
      <FilterCustomers
        filter={filter}
        handleFilterChange={handleFilterChange}
        drivers={drivers}
      />
    </div>
    <h4 className="text-center">Customers</h4>
    <Table responsive striped style={{overflowY: 'auto', maxHeight: '100%'}}>
      <thead>
        <tr>
          <th style={{padding: '0 0 0 4px'}}>
            <Checkbox
              checked={allSelected}
              onChange={allSelected ? handleDeselectAll : handleSelectAll}
              style={{marginBottom: '7px'}}
            />
          </th>
          <th>#</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {customers.map(customer =>
          <tr
            key={customer._id}
            className={isSelected(customer._id) ? 'active' : ''}
            onClick={handleSelect(customer._id)}
            style={{cursor: 'pointer'}}
          >
            <td style={{padding: '0 0 0 4px'}}>
              <Checkbox
                checked={isSelected(customer._id)}
                readOnly
              />
            </td>
            <td><span>{customer._id}</span></td>
            <td><span>
              {getAddress(customer, 2)}
            </span></td>
          </tr>
        )}
        {!customers.length &&
          <tr>
            <td className="text-center alert alert-danger" colSpan="4">No matching customers.</td>
          </tr>
        }
      </tbody>
    </Table>
  </div>

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CustomerSelector)
