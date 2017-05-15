import {get} from 'lodash'

const CLEAR_ROUTE = 'assignment/route/CLEAR_ROUTE'
const ROUTE_REQUEST = 'assignment/route/ROUTE_REQUEST'
const ROUTE_SUCCESS = 'assignment/route/ROUTE_SUCCESS'
const ROUTE_FAILURE = 'assignment/route/ROUTE_FAILURE'

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
    default: return state
  }
}

export const createSelectors = path => ({
  isFetching: state => get(state, path).routeFetching,
  hasError: state => get(state, path).routeError,
  getRoute: state => get(state, path).route
})
