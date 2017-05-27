import React from 'react'
import {connect} from 'react-redux'
import {Button, ListGroupItem} from 'react-bootstrap'

import selectors from '../../../../store/selectors'
import {assignCustomers} from '../../reducers/assignment'
import {clearRoute, requestRoute} from '../../reducers/route'

const mapStateToProps = (state, ownProps) => ({
  settings: selectors.settings.getSettings(state),
  driver: ownProps.driver,
  selectedDriverId: selectors.delivery.assignment.getDriverId(state),
  getCustomer: id => selectors.customer.getOne(state)(id),
  selectedCustomerIds: selectors.delivery.assignment.getSelectedCustomerIds(state),
  route: selectors.delivery.route.getRoute(state)
})

const mapDispatchToProps = dispatch => ({
  assign: (customerIds, driverId) => dispatch(assignCustomers(customerIds, driverId)),
  clearRoute: () => dispatch(clearRoute()),
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
      stateProps.settings.location,
      stateProps.driver.location,
      stateProps.selectedCustomerIds.map(id => stateProps.getCustomer(id).location)
    )
  }
})

const DriverListDetail = ({
  driver,
  selectedDriverId,
  selectedCustomerIds,
  assign,
  clearRoute,
  requestRoute,
  route
}) =>
  <ListGroupItem>
      <div style={{display: 'flex'}}>
        <div style={{flexGrow: 2}}>
          {driver.fullName}
        </div>
        <div>
          <span style={{padding: '0 8px'}}>
            {driver.customers.length}
          </span>
          <i className="fa fa-users" style={{color: '#777'}} />
        </div>
      </div>
    <div className="text-right" style={{margin: '0 auto'}}>
      {route ?
        <Button
          bsStyle="primary"
          onClick={clearRoute}
          style={{margin: '10px 10px 0 0'}}
        >
          Clear Route
        </Button> :
        <Button
          bsStyle="primary"
          onClick={requestRoute}
          disabled={!selectedCustomerIds.length || !selectedDriverId}
          style={{margin: '10px 10px 0 0'}}
        >
          Suggest Route
        </Button>
      }
      {' '}
      <Button
        bsStyle="success"
        onClick={assign}
        disabled={!selectedCustomerIds.length || !selectedDriverId}
        style={{marginTop: '10px'}}
      >
        Assign Selected
      </Button>
    </div>
  </ListGroupItem>

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DriverListDetail)
