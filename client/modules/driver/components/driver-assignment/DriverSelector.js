import React from 'react'
import {compose, withState, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'

import selectors from '../../../../store/selectors'
import {setFilter, setDriver, selectCustomers} from '../../reducers/assignment'
import {setAllWaypoints, clearRoute} from '../../reducers/route'
import DriverList from './DriverList'
import SelectedDriver from './SelectedDriver'

const mapStateToProps = state => ({
  getDriver: selectors.volunteer.getOne(state),
  getCustomer: selectors.customer.getOne(state),
  selectedDriverId: selectors.delivery.assignment.getDriverId(state),
  selectedCustomerIds: selectors.delivery.assignment.getSelectedCustomerIds(state),
  drivers: selectors.volunteer.getAllDrivers(state),
  settings: selectors.settings.getSettings(state)
})

const mapDispatchToProps = dispatch => ({
  setDriver: id => {
    dispatch(setDriver(id))
    dispatch(clearRoute())
  },
  selectCustomers: customers => dispatch(selectCustomers(customers)),
  setAllWaypoints: waypoints => dispatch(setAllWaypoints(waypoints)),
  setFilter: id => dispatch(setFilter(id))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  setDriver: id => {
    const driver = stateProps.getDriver(id)

    dispatchProps.setDriver(id)
    dispatchProps.setFilter(id)
    dispatchProps.selectCustomers(driver.customers)

    dispatchProps.setAllWaypoints([
      stateProps.settings,
      ...driver.customers,
      driver
    ])
  }
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  withState('showAllDrivers', 'toggleShowAllDrivers', true),
  withHandlers({
    toggleShowAllDrivers: ({showAllDrivers, toggleShowAllDrivers}) => () =>
      toggleShowAllDrivers(!showAllDrivers),
    selectDriver: ({setDriver, toggleShowAllDrivers}) => id => () => {
      setDriver(id)
      toggleShowAllDrivers(false)
    }
  })
)

export const DriverSelector = ({
  selectedDriverId,
  drivers,
  getDriver,
  selectDriver,
  showAllDrivers,
  toggleShowAllDrivers,
}) =>
  <div>
    <label>Drivers:</label>
    {selectedDriverId && <SelectedDriver driver={getDriver(selectedDriverId)} />}
    {showAllDrivers &&
      <DriverList
        drivers={drivers}
        selectedDriverId={selectedDriverId}
        setDriver={selectDriver}
      />
    }
    <div className="text-center">
      <Button
        onClick={toggleShowAllDrivers}
        style={{height: '24px', width: '40px', paddingTop: 0}}
      >
        <i className={`fa fa-angle-double-${showAllDrivers ? 'up' : 'down'}`} />
      </Button>
    </div>
  </div>

export default enhance(DriverSelector)
