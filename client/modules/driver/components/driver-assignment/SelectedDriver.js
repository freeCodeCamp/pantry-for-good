import React from 'react'
import {connect} from 'react-redux'
import {Button, ListGroupItem} from 'react-bootstrap'

import RouteSummary from './RouteSummary'
import selectors from '../../../../store/selectors'
import {assignCustomers} from '../../reducers/assignment'
import {clearRoute, requestGoogleRoute} from '../../reducers/route'
import {saveVolunteer} from '../../../volunteer/reducer'

import selectedDriverIcon from '../../images/car-red2.png'

const mapStateToProps = state => ({
  settings: selectors.settings.getSettings(state),
  selectedDriverId: selectors.delivery.assignment.getDriverId(state),
  getVolunteer: selectors.volunteer.getOne(state),
  getCustomer: id => selectors.customer.getOne(state)(id),
  selectedCustomerIds: selectors.delivery.assignment.getSelectedCustomerIds(state),
  route: selectors.delivery.route.getRoute(state),
  waypoints: selectors.delivery.route.getAllWaypoints(state),
  customerWaypoints: selectors.delivery.route.getWaypoints(state),
  routeLoading: selectors.delivery.route.isFetching(state)
})

const mapDispatchToProps = dispatch => ({
  assign: (customerIds, driverId) => dispatch(assignCustomers(customerIds, driverId)),
  clearRoute: () => dispatch(clearRoute()),
  requestRoute: waypoints => dispatch(requestGoogleRoute(waypoints, true)),
  saveVolunteer: volunteer => dispatch(saveVolunteer(volunteer))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  assign: () => dispatchProps.assign(
    stateProps.selectedCustomerIds, stateProps.selectedDriverId),
  requestRoute: () => dispatchProps.requestRoute(stateProps.waypoints),
  saveRoute: () => dispatchProps.saveVolunteer({
    ...stateProps.getVolunteer(stateProps.selectedDriverId),
    customers: stateProps.route.routes[0].waypoint_order.map(index =>
      stateProps.customerWaypoints[index]._id),
    optimized: true
  })
})

const DriverListDetail = ({
  driver,
  assign,
  settings,
  clearRoute,
  requestRoute,
  saveRoute,
  route,
  waypoints,
  routeLoading
}) =>
  <ListGroupItem>
    <div style={{display: 'flex'}}>
      <img
        src={selectedDriverIcon}
        style={{
          marginRight: '10px',
          width: '24px',
          height: '24px'
        }}
      />
      <div style={{flexGrow: 1}}>
        {driver.fullName}
      </div>
      <div>
        <span style={{padding: '0 8px'}}>
          {driver.customers.length}
        </span>
        <i className="fa fa-users" style={{ color: '#777' }} />
      </div>

    </div>
    {route ?
      <div className="text-center" style={{ margin: '0 auto' }}>
        <RouteSummary route={route} settings={settings}/>
        <Button
          bsStyle="primary"
          onClick={clearRoute}
          style={{ margin: '10px 10px 0 0' }}
        >
          Clear Route
        </Button>
        {' '}
        <Button
          bsStyle="success"
          onClick={saveRoute}
          style={{ margin: '10px 10px 0 0' }}
        >
          Save Route
        </Button>
      </div> :
      <div className="text-center" style={{ margin: '0 auto' }}>
        <Button
          bsStyle="primary"
          onClick={requestRoute}
          disabled={waypoints.length <= 2 || routeLoading}
          style={{ margin: '10px 10px 0 0' }}
        >
          Suggest Route
        </Button>
        {' '}
        <Button
          bsStyle="success"
          onClick={assign}
          style={{ marginTop: '10px' }}
        >
          Assign Selected
        </Button>
      </div>
    }
  </ListGroupItem>

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DriverListDetail)
