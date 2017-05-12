import React from 'react'
import {connect} from 'react-redux'
import {noop} from 'lodash'
import {Marker} from 'react-google-maps'
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer'

import selectors from '../../../../store/selectors'
import {toggleCustomer, selectCluster} from '../../reducers/assignment'
import Map from '../Map'

import pinkMarker from '../../images/gm-marker-pink.png'
import blueMarker from '../../images/gm-marker-blue.png'
import driverMarker from '../../images/driver-marker.png'
import solidMarker from '../../images/client-marker.png'
import bluecluster from '../../images/m1-cyan.png'
import purpleCluster from '../../images/m1-purple.png'
import pinkCluster from '../../images/m1-pink.png'

const mapStateToProps = state => ({
  settings: selectors.settings.getSettings(state),
  customers: selectors.delivery.assignment.getFilteredCustomers(state),
  isSelected: selectors.delivery.assignment.isCustomerSelected(state),
  selectedCustomerIds: selectors.delivery.assignment.getSelectedCustomerIds(state),
  route: selectors.delivery.route.getRoute(state)
})

const mapDispatchToProps = dispatch => ({
  toggleCustomer: id => () => dispatch(toggleCustomer(id)),
  selectCluster: (cluster, customers, selectedCustomerIds) =>
    dispatch(selectCluster(cluster, customers, selectedCustomerIds))
})

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  selectCluster: cluster => dispatchProps.selectCluster(
    cluster, stateProps.customers, stateProps.selectedCustomerIds)
})

const loadingElement = (
  <div className="overlay"><i className="fa fa-refresh fa-spin"></i></div>
)

const clusterStyles = [
  {url: bluecluster, height: 52, width: 53},
  {url: purpleCluster, height: 52, width: 53},
  {url: pinkCluster, height: 52, width: 53}
]

const SelectCustomersMap = ({
  settings,
  customers,
  isSelected,
  route,
  toggleCustomer,
  selectCluster
}) =>
  settings ?
    <div>
      <Map
        googleMapURL={getGoogleMapURL(settings)}
        loadingElement={loadingElement}
        containerElement={<div className="googleMap" />}
        mapElement={<div style={{ height: '100%' }} />}
        onMapLoad={noop}
        onMapClick={noop}
        onMarkerRightClick={noop}
        route={route}
        defaultCenter={settings.location}
      >
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
                icon={isSelected(customer.id) ? pinkMarker : blueMarker}
                position={customer.location}
                onClick={toggleCustomer(customer.id)}
              /> :
              null
          )}
        </MarkerClusterer>
        <Marker icon={solidMarker} position={settings.location} />
      </Map>
    </div> :
    null

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SelectCustomersMap)

function getGoogleMapURL(settings) {
  const {gmapsApiKey, gmapsClientId} = settings
  const baseUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&'
  return gmapsClientId ?
    `${baseUrl}id=${gmapsClientId}` :
    `${baseUrl}key=${gmapsApiKey}`
}

function calculator(markers) {
  const total = markers.length
  const selected = markers.reduce((acc, marker) =>
    marker.icon.match(/pink/) ? acc + 1 : acc
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
