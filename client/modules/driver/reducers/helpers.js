import {first, last} from 'lodash'
import polyline from '@mapbox/polyline'

const osrmUrl = 'https://router.project-osrm.org'
const GOOGLE_ERROR_MAP = {
  MAX_WAYPOINTS_EXCEEDED: 'Cannot find route for this many stops.',
  OVER_QUERY_LIMIT: 'You have made too many requests for the current time period.'
}
const DEFAULT_GOOGLE_ERROR = 'There was an error calculating the route.'

export const getGoogleRoute = (waypoints, optimize) => {
  const formattedWaypoints = waypoints.map(point => ({
    location: {lat: point.lat, lng: point.lng}
  }))

  return new Promise((resolve, reject) => {
    const directionsService = new google.maps.DirectionsService
    directionsService.route({
      origin: first(formattedWaypoints),
      destination: last(formattedWaypoints),
      waypoints: formattedWaypoints.slice(1, -1),
      optimizeWaypoints: optimize,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        resolve(result)
      } else {
        const error = new Error(GOOGLE_ERROR_MAP[status] || DEFAULT_GOOGLE_ERROR)
        error.isDirectionsError = true
        reject(error)
      }
    })
  })
}

export const getOsrmRoute = (waypoints, optimize) => {
  const pointsString = waypoints.map(point => `${point.lng},${point.lat}`).join(';')
  if (optimize) {
    const options = 'roundtrip=false&source=first&destination=last'
    return fetch(`${osrmUrl}/trip/v1/driving/${pointsString}?${options}`)
  }

  const options = 'geometries=geojson&steps=true&overview=full'
  return fetch(`${osrmUrl}/route/v1/driving/${pointsString}?${options}`)
}


export const getCrudeRoute = waypoints => {
  const coordinates = waypoints.map(point => [point.lng, point.lat])

  return polyline.fromGeoJSON({
    type: 'LineString',
    coordinates
  })
}
