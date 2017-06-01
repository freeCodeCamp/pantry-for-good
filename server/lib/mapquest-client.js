import fetch from 'isomorphic-fetch'
import polyline from '@mapbox/polyline'

import config from '../config'

const baseUrl = 'http://open.mapquestapi.com/directions/v2'
const directionsUrl = `${baseUrl}/route?key=${config.mapquestKey}`
const optimizeUrl = `${baseUrl}/optimizedroute?key=${config.mapquestKey}`

const defaultOptions = {
  shapeFormat: 'cmp',  // return polyline
  generalize: 0  // max detail
}

export const getDirections = (waypoints, options) => {
  const body = JSON.stringify({
    locations: polylineToLatLngStrings(waypoints),
    options: defaultOptions
  })

  const url = options.optimize ? optimizeUrl : directionsUrl
  return fetch(url, {
    method: 'POST',
    body
  }).then(res => res.json().then(json => ({
    geometry: json.route.shape.shapePoints,
    waypoints: json.route.locationSequence,
    legs: json.route.legs
  })))
}

function polylineToLatLngStrings(line) {
  return polyline.decode(line).map(points => points.join(','))
}
