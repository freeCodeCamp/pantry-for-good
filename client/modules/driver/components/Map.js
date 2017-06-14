import React from 'react'
import {withGoogleMap, GoogleMap} from 'react-google-maps'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'

export const getGoogleMapURL = settings => {
  const {gmapsApiKey, gmapsClientId} = settings
  const baseUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing&'

  return gmapsClientId ?
    `${baseUrl}client=${gmapsClientId}` :
    `${baseUrl}key=${gmapsApiKey}`
}

const Map = withScriptjs(withGoogleMap(
  props =>
    <GoogleMap
      ref={props.onMapLoad}
      defaultZoom={12}
      defaultCenter={props.defaultCenter}
      defaultOptions={props.defaultOptions}
      onClick={props.onMapClick}
    >
      {props.children}
    </GoogleMap>
))

export default Map
