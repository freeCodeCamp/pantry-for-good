import React from 'react'
import {withGoogleMap, GoogleMap, DirectionsRenderer} from "react-google-maps"
import withScriptjs from "react-google-maps/lib/async/withScriptjs"

const Map = withScriptjs(withGoogleMap(
  props =>
    <GoogleMap
      ref={props.onMapLoad}
      defaultZoom={12}
      defaultCenter={props.defaultCenter}
      defaultOptions={props.defaultOptions}
      onClick={props.onMapClick}
    >
      {props.route && <DirectionsRenderer directions={props.route} />}
      {props.children}
    </GoogleMap>
))

export default Map
