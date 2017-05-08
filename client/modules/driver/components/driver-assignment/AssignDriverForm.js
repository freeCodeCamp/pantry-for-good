import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'

import {selectors, deliverySelectors} from '../../../../store'
import {
  setDriver,
  assignCustomers
} from '../../reducers/assignment'
import {requestRoute} from '../../reducers/route'
import {FieldGroup} from '../../../../components/form'

const mapStateToProps = state => ({
  location: state.settings.data.location,
  getCustomer: selectors.getOneCustomer(state),
  selectedCustomerIds: deliverySelectors.assignment.getSelectedCustomerIds(state),
  selectedDriverId: deliverySelectors.assignment.getDriverId(state),
  drivers: selectors.getAllDrivers(state)
})

const mapDispatchToProps = dispatch => ({
  assign: (customerIds, driverId) => dispatch(assignCustomers(customerIds, driverId)),
  setDriver: ev => dispatch(setDriver(ev.target.value)),
  requestRoute: (start, end, waypoints) =>
    dispatch(requestRoute(start, end, waypoints))
})

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  assign: () =>
    dispatchProps.assign(stateProps.selectedCustomerIds, stateProps.selectedDriverId),
  requestRoute: () => {
    dispatchProps.requestRoute(
      stateProps.location,
      // stateProps.location,
      stateProps.drivers.find(driver =>
        driver.id === stateProps.selectedDriverId).location,
      stateProps.selectedCustomerIds.map(id => stateProps.getCustomer(id).location)
    )
  }
})

const AssignDriverForm = ({
  selectedCustomerIds,
  selectedDriverId,
  drivers,
  assign,
  requestRoute,
  setDriver
}) =>
  <div style={{
    display: 'flex',
    alignContent: 'space-between',
    alignItems: 'center'
  }}>
    <FieldGroup
      name="selectedDriver"
      type="select"
      label="Assign To"
      value={selectedDriverId}
      onChange={setDriver}
      style={{flexGrow: 1, marginRight: '10px'}}
    >
      <option value="">Select a driver</option>
      {drivers && drivers.map(driver =>
        <option key={driver.id} value={driver.id}>
          {driver.fullName}
        </option>
      )}
    </FieldGroup>
    <Button
      bsStyle="primary"
      onClick={requestRoute}
      disabled={!selectedCustomerIds.length || !selectedDriverId}
      style={{margin: '10px 10px 0 0'}}
    >
      Directions
    </Button>
    {' '}
    <Button
      bsStyle="success"
      onClick={assign}
      disabled={!selectedCustomerIds.length || !selectedDriverId}
      style={{marginTop: '10px'}}
    >
      Assign
    </Button>
  </div>

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AssignDriverForm)
