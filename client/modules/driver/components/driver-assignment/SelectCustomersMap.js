import React from 'react'
import {connect} from 'react-redux'
import {noop} from 'lodash'
import {Marker} from 'react-google-maps'
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer'

import {selectors, deliverySelectors} from '../../../../store'
import {toggleCustomer, selectCluster} from '../../reducers/assignment'
import Map from '../Map'

import pinkMarker from '../../images/gm-marker-pink.png'
import blueMarker from '../../images/gm-marker-blue.png'
import driverMarker from '../../images/driver-marker.png'
import solidMarker from '../../images/client-marker.png'

const mapStateToProps = state => ({
  settings: state.settings.data,
  customers: deliverySelectors.assignment.getFilteredCustomers(state),
  isSelected: deliverySelectors.assignment.isCustomerSelected(state),
  selectedCustomerIds: deliverySelectors.assignment.getSelectedCustomerIds(state),
  route: deliverySelectors.route.getRoute(state)
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
          gridSize={60}
          zoomOnClick={false}
          onClick={selectCluster}
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

// cluster => {
//             console.log('cluster', cluster)
//             {/*console.log('cluster.isMarkerInClusterBounds',
//             customers.filter(customer =>
//               cluster.isMarkerInClusterBounds({
//                 getPosition: function() {return {lat: 51.48, lng: -3.15}}
//               })
//             )*/}

//             // get {id, location} from customers array
//             // filter by in bounds
//             // toggle select remaining customers
//           }}
