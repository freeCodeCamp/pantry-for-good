import React from 'react'
import {connect} from 'react-redux'
import {Marker} from 'react-google-maps'
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer'

import selectors from '../../../../store/selectors'
import {toggleCustomer, selectCluster, setDriver} from '../../reducers/assignment'

import selectedCustomerIcon from '../../images/gm-marker-pink.png'
import customerIcon from '../../images/gm-marker-blue.png'
import selectedDriverIcon from '../../images/gm-marker-orange.png'
import driverIcon from '../../images/gm-marker-yellow.png'
import foodbankIcon from '../../images/gm-marker-green.png'
import unselectedClusterIcon from '../../images/m1-cyan.png'
import partSelectedClusterIcon from '../../images/m1-purple.png'
import selectedClusterIcon from '../../images/m1-pink.png'

const mapStateToProps = state => ({
  settings: selectors.settings.getSettings(state),
  customers: selectors.delivery.assignment.getFilteredCustomers(state),
  isSelected: selectors.delivery.assignment.isCustomerSelected(state),
  selectedCustomerIds: selectors.delivery.assignment.getSelectedCustomerIds(state),
  drivers: selectors.volunteer.getAllDrivers(state),
  selectedDriverId: selectors.delivery.assignment.getDriverId(state),
  route: selectors.delivery.route.getRoute(state)
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
  route,
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
      gridSize={20}
      zoomOnClick={false}
      onClick={selectCluster}
      calculator={calculator}
      styles={clusterStyles}
    >
      {!route && customers && customers.map(customer =>
        customer.location ?
          <Marker
            key={customer.id}
            icon={isSelected(customer.id) ? selectedCustomerIcon : customerIcon}
            position={customer.location}
            onClick={toggleCustomer(customer.id)}
          /> :
          null
      )}
    </MarkerClusterer>
    {!route && drivers && drivers.map(driver =>
      <Marker
        key={driver.id}
        icon={isDriverSelected(driver.id) ? selectedDriverIcon : driverIcon}
        position={driver.location}
        onClick={selectDriver(driver.id)}
      />
    )}
    <Marker icon={foodbankIcon} position={settings.location} />
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
