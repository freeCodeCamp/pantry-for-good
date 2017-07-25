import React from 'react'
import {connect} from 'react-redux'
import {DirectionsRenderer} from 'react-google-maps'
import {noop} from 'lodash'

import selectors from '../../../../../store/selectors'
import Map, {getGoogleMapURL} from '../../Map'
import Markers from './Markers'
// import RouteLayer from './RouteLayer'
// import WaypointsLayer from './WaypointsLayer'

const mapStateToProps = state => ({
  route: selectors.delivery.route.getRoute(state),
  settings: selectors.settings.getSettings(state)
})

const loadingElement = (
  <div className="overlay"><i className="fa fa-refresh fa-spin"></i></div>
)

const RouteMap = ({route, settings, driver}) =>
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
    {route ?
      <DirectionsRenderer directions={route} /> :
      <Markers driverId={driver._id} />
    }
  </Map>

export default connect(mapStateToProps)(RouteMap)
