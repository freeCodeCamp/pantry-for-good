import {get} from 'lodash'

const CLEAR_ROUTE = 'assignment/route/CLEAR_ROUTE'
const ROUTE_REQUEST = 'assignment/route/ROUTE_REQUEST'
const ROUTE_SUCCESS = 'assignment/route/ROUTE_SUCCESS'
const ROUTE_FAILURE = 'assignment/route/ROUTE_FAILURE'
const DISTANCE_REQUEST = 'assignment/route/DISTANCE_REQUEST'
const DISTANCE_SUCCESS = 'assignment/route/DISTANCE_SUCCESS'
const DISTANCE_FAILURE = 'assignment/route/DISTANCE_FAILURE'

export const clearRoute = () => ({type: CLEAR_ROUTE})

export const requestRoute = (origin, destination, waypoints) => dispatch => {
  dispatch({type: ROUTE_REQUEST, origin, destination, waypoints})
  waypoints = waypoints.map(point => ({location: {lat: point.lat, lng: point.lng}}))

  let directionsService
  try {
    directionsService = new google.maps.DirectionsService
    directionsService.route({
      origin,
      destination,
      waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        dispatch({type: ROUTE_SUCCESS, result})
      } else {
        dispatch({type: ROUTE_FAILURE, error: result})
      }
    })
  } catch (err) {
    dispatch({type: ROUTE_FAILURE, error: 'Direction service failure'})
  }
}

export const requestDistances = (origin, destination, waypoints) => dispatch => {
  dispatch({type: DISTANCE_REQUEST})
  const waypointCoords = [
    `${origin.lng},${origin.lat}`,
    `${destination.lng},${destination.lat}`,
    ...waypoints.map(point => `${point.lng},${point.lat}`)
  ].join(';')
  fetch(`https://router.project-osrm.org/table/v1/driving/${waypointCoords}`)
    .then(res => res.json().then(json =>
      dispatch({type: DISTANCE_SUCCESS, result: json.durations})))
    .catch(error => dispatch({type: DISTANCE_FAILURE, error}))
}

export default (state = {
  route: null
}, action) => {
  switch (action.type) {
    case CLEAR_ROUTE:
      return {
        ...state,
        route: null
      }
    case ROUTE_REQUEST:
      return {
        ...state,
        fetching: true,
        error: null
      }
    case ROUTE_SUCCESS:
      return {
        ...state,
        fetching: false,
        error: null,
        route: action.result
      }
    case ROUTE_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.error
      }
    case DISTANCE_REQUEST:
      return {
        ...state,
        fetching: true,
        error: null
      }
    case DISTANCE_SUCCESS:
      return {
        ...state,
        fetching: false,
        error: null,
        distances: action.result
      }
    case DISTANCE_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.error
      }
    default: return state
  }
}

export const createSelectors = path => ({
  isFetching: state => get(state, path).routeFetching,
  hasError: state => get(state, path).routeError,
  getRoute: state => get(state, path).route
})
