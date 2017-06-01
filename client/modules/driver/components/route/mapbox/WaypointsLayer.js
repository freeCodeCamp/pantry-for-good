import React from 'react'
import {connect} from 'react-redux'
import {GeoJSONLayer} from 'react-mapbox-gl'

import selectors from '../../../../../store/selectors'

const symbolProperties = {
  'text-field': '{name}',
  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
  'text-offset': [0, 0.5],
  'text-anchor': 'top'
}

const mapStateToProps = state => ({
  origin: selectors.delivery.route.getOrigin(state),
  waypoints: selectors.delivery.route.getWaypoints(state),
  destination: selectors.delivery.route.getDestination(state)
})

const WaypointsLayer = ({origin, waypoints, destination}) =>
  <div>
    <GeoJSONLayer
      data={{
        type: 'FeatureCollection',
        features: waypoints.map((point, i) => {
          const name = i + 1

          return {
            type: 'Feature',
            properties: {name},
            geometry: {
              type: 'Point',
              coordinates: [point.lng, point.lat]
            }
          }
        })
      }}
      circleLayout={{ visibility: 'visible' }}
      circlePaint={{
        'circle-radius': 6,
        'circle-color': 'rgba(55,148,179,1)'
      }}
      symbolLayout={symbolProperties}
    />
    <GeoJSONLayer
      data={{
        type: 'FeatureCollection',
        features: [origin, destination].map((point, i) => {
          const name = i === 0 ? 'Start' : 'End'

          return {
            type: 'Feature',
            properties: {name},
            geometry: {
              type: 'Point',
              coordinates: [point.lng, point.lat]
            }
          }
        })
      }}
      circleLayout={{ visibility: 'visible' }}
      circlePaint={{
        'circle-radius': 6,
        'circle-color': 'rgba(179,48,79,1)'
      }}
      symbolLayout={symbolProperties}
    />

  </div>

export default connect(mapStateToProps)(WaypointsLayer)
