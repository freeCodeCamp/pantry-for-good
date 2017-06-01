import React from 'react'
import {GeoJSONLayer} from 'react-mapbox-gl'
import polyline from '@mapbox/polyline'

const RouteLayer = ({route}) =>
  <GeoJSONLayer
    id="route"
    data={polyline.toGeoJSON(route.geometry)}
    lineLayout={{
      "line-join": "round",
      "line-cap": "round"
    }}
    linePaint={{
      "line-color": "rgba(55,148,179,0.7)",
      "line-width": 4,
    }}
  />

export default RouteLayer
