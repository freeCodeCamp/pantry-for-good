import React from 'react'
import {connect} from 'react-redux'
import ReactMapboxGl from 'react-mapbox-gl'

import selectors from '../../../../../store/selectors'
import RouteLayer from './RouteLayer'
import WaypointsLayer from './WaypointsLayer'

const mapStateToProps = state => ({
  route: selectors.delivery.route.getRoute(state),
  settings: selectors.settings.getSettings(state)
})

const RouteMap = ({route, settings}) =>
  <ReactMapboxGl
    style='https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json'
    containerStyle={{
      height: 'calc(100vh - 130px)'
    }}
    center={[settings.location.lng, settings.location.lat]}
    attributionControl={true}
  >
    <WaypointsLayer />
    {route && <RouteLayer route={route} />}
  </ReactMapboxGl>

export default connect(mapStateToProps)(RouteMap)


// https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json
// mapbox://styles/mapbox/streets-v9?optimize=true
