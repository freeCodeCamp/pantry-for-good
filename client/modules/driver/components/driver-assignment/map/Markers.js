import React from 'react'
import {connect} from 'react-redux'
import {Marker} from 'react-google-maps'
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer'

import selectors from '../../../../../store/selectors'
import {toggleCustomer, selectCluster, setDriver} from '../../../reducers/assignment'

import selectedCustomerIcon from '../../../images/gm-marker-pink.png'
import customerIcon from '../../../images/gm-marker-blue.png'
import selectedDriverIcon from '../../../images/car-red2.png'
import driverIcon from '../../../images/car-green2.png'
import foodbankIcon from '../../../images/home2.png'
import unselectedClusterIcon from '../../../images/m1-cyan.png'
import partSelectedClusterIcon from '../../../images/m1-purple.png'
import selectedClusterIcon from '../../../images/m1-pink.png'

const mapStateToProps = state => ({
  settings: selectors.settings.getSettings(state),
  customers: selectors.delivery.assignment.getFilteredCustomers(state),
  isSelected: selectors.delivery.assignment.isCustomerSelected(state),
  selectedCustomerIds: selectors.delivery.assignment.getSelectedCustomerIds(state),
  drivers: selectors.volunteer.getAllDrivers(state),
  selectedDriverId: selectors.delivery.assignment.getDriverId(state)
})

const mapDispatchToProps = dispatch => ({
  toggleCustomer: id => () => dispatch(toggleCustomer(id)),
  selectCluster: (cluster, customers, selectedCustomerIds) =>
    dispatch(selectCluster(cluster, customers, selectedCustomerIds)),
  selectDriver: id => () => dispatch(setDriver(id))
})

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  selectCluster: cluster => dispatchProps.selectCluster(
    cluster, stateProps.customers, stateProps.selectedCustomerIds),
  isDriverSelected: id => id === stateProps.selectedDriverId
})

const clusterStyles = [
  {url: unselectedClusterIcon, height: 52, width: 53},
  {url: partSelectedClusterIcon, height: 52, width: 53},
  {url: selectedClusterIcon, height: 52, width: 53}
]

const Markers = ({
  settings,
  customers,
  isSelected,
  toggleCustomer,
  drivers,
  isDriverSelected,
  selectDriver,
  selectCluster
}) =>
  <div>
    <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={30}
      zoomOnClick={false}
      onClick={selectCluster}
      calculator={calculator}
      styles={clusterStyles}
    >
      {customers && customers.filter(c => c.location).map(customer =>
        <Marker
          key={customer._id}
          icon={isSelected(customer._id) ? selectedCustomerIcon : customerIcon}
          position={customer.location}
          onClick={toggleCustomer(customer._id)}
        />
      )}
    </MarkerClusterer>
    {drivers && drivers.map(driver =>
      <Marker
        key={driver._id}
        icon={isDriverSelected(driver._id) ? selectedDriverIcon : driverIcon}
        position={driver.location}
        onClick={selectDriver(driver._id)}
        title={driver.fullName}
      />
    )}
    <Marker
      icon={foodbankIcon}
      position={settings.location}
      title={settings.organization}
    />
  </div>

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Markers)

function calculator(markers) {
  const total = markers.length
  const selected = markers.reduce((acc, marker) =>
    marker.icon === selectedCustomerIcon ? acc + 1 : acc
    , 0)
  const unselected = total - selected

  let index
  if (!unselected) index = 3
  else if (selected) index = 2
  else index = 1

  return {
    text: total,
    index,
    title: `${selected} selected`
  }
}
