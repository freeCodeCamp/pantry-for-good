import React from 'react'
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import withScriptjs from "react-google-maps/lib/async/withScriptjs"

const Map = withScriptjs(
  withGoogleMap(
    props => (
      <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={12}
        defaultCenter={props.defaultCenter}
        defaultOptions={props.defaultOptions}
        onClick={props.onMapClick}
      >
        {props.markers.map((marker, i) => (
          <Marker
            {...marker}
            key={i}
            onRightClick={() => props.onMarkerRightClick(marker)}

          />
        ))}
      </GoogleMap>
    )
  )
)

export default Map
