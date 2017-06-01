import objectify from 'geoposition-to-object'
import {get} from 'lodash'

// TODO: pass as param / proxy through api
const LOCATION_URL = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCASB95kRU_cIYk8LaG8tS-HY4pgV47hMU&address='

const LOCATE_ADDRESS_REQUEST = 'delivery/location/LOCATE_ADDRESS_REQUEST'
const LOCATE_ADDRESS_SUCCESS = 'delivery/location/LOCATE_ADDRESS_SUCCESS'
const LOCATE_ADDRESS_FAILURE = 'delivery/location/LOCATE_ADDRESS_FAILURE'
const LOCATE_USER_REQUEST = 'delivery/location/LOCATE_USER_REQUEST'
const LOCATE_USER_SUCCESS = 'delivery/location/LOCATE_USER_SUCCESS'
const LOCATE_USER_FAILURE = 'delivery/location/LOCATE_USER_FAILURE'

const locateAddressRequest = () => ({type: LOCATE_ADDRESS_REQUEST})

const locateAddressSuccess = address => ({
  type: LOCATE_ADDRESS_SUCCESS,
  address
})

const locateAddressFailure = error => ({
  type: LOCATE_ADDRESS_FAILURE,
  error
})

const locateUserRequest = () => ({type: LOCATE_USER_REQUEST})

const locateUserSuccess = user => ({
  type: LOCATE_USER_SUCCESS,
  user: objectify(user)
})

const locateUserFailure = error => ({
  type: LOCATE_USER_FAILURE,
  error
})

export const locateAddress = address => dispatch => {
  dispatch(locateAddressRequest())
  fetch(LOCATION_URL + address)
    .then(response =>
      response.json().then(json => {
        if (!response.ok) dispatch(locateAddressFailure(json))
        dispatch(locateAddressSuccess({
          ...json.results[0],
          query: address
        }))
      })
    )
}

let watch

export const locateUser = () => dispatch => {
  dispatch(locateUserRequest())
  if (!navigator.geolocation)
    return dispatch(locateUserFailure('Geolocation not supported'))

  if (watch) stopLocateUser()

  watch = navigator.geolocation.watchPosition(
    pos => dispatch(locateUserSuccess(pos)),
    err => dispatch(locateUserFailure(err))
  )
}

export const stopLocateUser = () => navigator.geolocation.clearWatch(watch)

export default (state = {}, action) => {
  switch (action.type) {
    case LOCATE_ADDRESS_REQUEST:
      return {
        ...state,
        fetchingAddress: true,
        errorAddress: null
      }
    case LOCATE_USER_REQUEST:
      return {
        ...state,
        fetchingUser: true,
        errorUser: null
      }
    case LOCATE_ADDRESS_SUCCESS:
      return {
        ...state,
        fetchingAddress: false,
        address: action.address
      }
    case LOCATE_USER_SUCCESS:
      return {
        ...state,
        fetchingUser: false,
        user: action.user
      }
    case LOCATE_ADDRESS_FAILURE:
      return {
        ...state,
        fetchingAddress: false,
        errorAddress: action.error
      }
    case LOCATE_USER_FAILURE:
      return {
        ...state,
        fetchingUser: false,
        errorUser: action.error
      }
    default: return state
  }
}

export const createSelectors = path => ({
  getAddressCoordinates: state => get(state, path, 'address.geometry.location'),
  getUserCoordinates: state => {
    const {latitude, longitude} = get(state, path, 'user.coords', {})
    return {
      lat: latitude,
      lng: longitude
    }
  },
  loadingAddressLocation: state => get(state, path, 'fetchingAddress'),
  loadAddressLocationError: state => get(state, path, 'errorAddress'),
  loadingUserLocation: state => get(state, path, 'fetchingUser'),
  loadUserLocationError: state => get(state, path, 'errorUser')
})
