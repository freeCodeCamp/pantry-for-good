import {differenceBy, first, get, last, unionBy} from 'lodash'
import polyline from '@mapbox/polyline'

import {getGoogleRoute, getCrudeRoute} from './helpers'
import getAddress from '../../../lib/get-address'
import {callApi} from '../../../store/middleware/api'

export const CLEAR_ROUTE = 'delivery/route/CLEAR_ROUTE'
export const ROUTE_REQUEST = 'delivery/route/ROUTE_REQUEST'
export const ROUTE_SUCCESS = 'delivery/route/ROUTE_SUCCESS'
export const ROUTE_FAILURE = 'delivery/route/ROUTE_FAILURE'
export const SET_WAYPOINTS = 'delivery/route/SET_WAYPOINTS'
export const SET_ALL_WAYPOINTS = 'delivery/route/SET_ALL_WAYPOINTS'
export const ADD_WAYPOINTS = 'delivery/route/ADD_WAYPOINTS'
export const REMOVE_WAYPOINTS = 'delivery/route/REMOVE_WAYPOINTS'
export const MOVE_WAYPOINT = 'delivery/route/MOVE_WAYPOINT'
export const SET_ORIGIN = 'delivery/route/SET_ORIGIN'
export const SET_DESTINATION = 'delivery/route/SET_DESTINATION'

export const clearRoute = () => ({type: CLEAR_ROUTE})

const routeRequest = () => ({type: ROUTE_REQUEST})

const routeSuccess = result => ({
  type: ROUTE_SUCCESS,
  result
})

const routeFailure = error => ({
  type: ROUTE_FAILURE,
  error
})

/**
 * set the waypoints excluding origin and destination
 *
 * @param {object[]} waypoints description
 */
export const setWaypoints = waypoints => ({
  type: SET_WAYPOINTS,
  waypoints: waypoints.map(makeWaypoint)
})

/**
 * set the waypoints including origin and destination
 * @param {object[]} waypoints description
 */
export const setAllWaypoints = waypoints => ({
  type: SET_ALL_WAYPOINTS,
  waypoints: waypoints.map(makeWaypoint)
})

export const setOrigin = origin => ({
  type: SET_ORIGIN,
  origin: makeWaypoint(origin)
})

export const setDestination = destination => ({
  type: SET_DESTINATION,
  destination: makeWaypoint(destination)
})

export const addWaypoints = waypoints => ({
  type: ADD_WAYPOINTS,
  waypoints: waypoints.map(makeWaypoint)
})

export const removeWaypoints = waypoints => ({
  type: REMOVE_WAYPOINTS,
  waypoints: waypoints.map(makeWaypoint)
})

export const moveWaypoint = (waypoint, idx, getWaypoints) => (dispatch, getState) => {
  dispatch({
    type: MOVE_WAYPOINT,
    waypoint,
    idx
  })

  // cant render this with google map
  // dispatch(
  requestCrudeRoute(getWaypoints(getState()))
  // )
}

export const requestGoogleRoute = (waypoints, optimize) => (dispatch, getState) => {
  // TODO: this should be using selectors, but the needed ones are defined here
  if (getState().delivery.route.fetching)
    return Promise.reject(new Error('Already requesting a route'))

  dispatch(routeRequest())
  return getGoogleRoute(waypoints, optimize)
    .then(res => {
      dispatch(routeSuccess(res))
      if (!optimize) return

      let optimizedWaypoints = []
      res.routes[0].waypoint_order.forEach((index, i) => {
        optimizedWaypoints[i] = waypoints[index + 1]
      })

      dispatch(setWaypoints(optimizedWaypoints))
    })
    .catch(err => {
      if (err.isDirectionsError) {
        dispatch(routeFailure(err.message))
      } else {
        console.error(err)
        dispatch(routeFailure('There was an error processing your request.'))
      }
    })
}

export const requestCrudeRoute = waypoints => dispatch => {
  dispatch(routeRequest())
  dispatch(routeSuccess({geometry: getCrudeRoute(waypoints)}))
}

export const requestMapquestRoute = (waypoints, optimize) => dispatch => {
  const codedWaypoints = polyline.encode(waypoints.map(point => [point.lat, point.lng]))

  callApi(`delivery/directions?waypoints=${codedWaypoints}&optimize=${optimize || 'false'}`)
    .then(route => {
      dispatch(routeSuccess(route))
      if (!optimize) return

      let optimizedWaypoints = []
      route.waypoints.slice(1, -1).forEach((index, i) => {
        optimizedWaypoints[i] = waypoints[index]
      })

      dispatch(setWaypoints(optimizedWaypoints))
    })
    .catch(error => dispatch(routeFailure(error)))
}

export default (state = {
  route: null
}, action) => {
  switch (action.type) {
    case CLEAR_ROUTE:
      return {
        ...state,
        error: null,
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
    case SET_WAYPOINTS:
      return {
        ...state,
        waypoints: action.waypoints
      }
    case SET_ALL_WAYPOINTS:
      return {
        ...state,
        origin: first(action.waypoints),
        waypoints: action.waypoints.slice(1, -1),
        destination: last(action.waypoints)
      }
    case ADD_WAYPOINTS:
      return {
        ...state,
        waypoints: unionBy(state.waypoints, action.waypoints, '_id')
      }
    case REMOVE_WAYPOINTS:
      return {
        ...state,
        waypoints: differenceBy(state.waypoints, action.waypoints, '_id')
      }
    case MOVE_WAYPOINT: {
      const withoutWaypoint = state.waypoints.filter(waypoint =>
        waypoint._id !== action.waypoint._id)
      return {
        ...state,
        waypoints: [
          ...withoutWaypoint.slice(0, action.idx),
          action.waypoint,
          ...withoutWaypoint.slice(action.idx)
        ]
      }
    }
    case SET_ORIGIN:
      return {
        ...state,
        origin: action.origin
      }
    case SET_DESTINATION:
      return {
        ...state,
        destination: action.destination
      }
    default: return state
  }
}

export const createSelectors = path => {
  const getWaypoints = state => get(state, path, {}).waypoints
  const getOrigin = state => get(state, path, {}).origin
  const getDestination = state => get(state, path, {}).destination

  return {
    isFetching: state => get(state, path).fetching,
    hasError: state => get(state, path).error,
    getRoute: state => get(state, path).route,
    getWaypoints,
    getOrigin,
    getDestination,
    getAllWaypoints: state => {
      const origin = getOrigin(state)
      const waypoints = getWaypoints(state)
      const destination = getDestination(state)

      if (!origin || !waypoints || !destination) return []
      return [
        origin,
        ...waypoints,
        destination
      ]
    }
  }
}

/**
 * create a waypoint from a customer, driver or settings
 *
 * @param {object} obj the object to extract location info from
 * @returns {object}
 */
function makeWaypoint(obj) {
  if (!obj.location) {
    // should already be a waypoint
    if (!obj.lat || !obj.lng || !obj._id || !obj.address)
      throw new Error('object not a valid waypoint')

    return obj
  }
  return {
    lat: obj.location.lat,
    lng: obj.location.lng,
    address: obj.address || obj.fields && getAddress(obj, 2),
    _id: obj.id || obj._id
  }
}
