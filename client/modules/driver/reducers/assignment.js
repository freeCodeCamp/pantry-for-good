import {difference, get, union} from 'lodash'
import {createSelector} from 'reselect'
import {normalize} from 'normalizr'

import {callApi} from '../../../store/middleware/api'
import {arrayOfCustomers, volunteer} from '../../../store/schemas'

const SET_FILTER = 'driver-assignment/SET_FILTER'
const SET_DRIVER = 'driver-assignment/SET_DRIVER'
const SELECT_CUSTOMERS = 'driver-assignment/SELECT_CUSTOMERS'
const TOGGLE_SELECT_CUSTOMER = 'driver-assignment/TOGGLE_CUSTOMER'
const ASSIGN_REQUEST = 'driver-assignment/ASSIGN_REQUEST'
const ASSIGN_SUCCESS = 'driver-assignment/ASSIGN_SUCCESS'
const ASSIGN_FAILURE = 'driver-assignment/ASSIGN_FAILURE'

export const setFilter = filter => ({
  type: SET_FILTER,
  filter
})

export const setDriver = driverId => ({
  type: SET_DRIVER,
  driverId
})

export const selectCustomers = customers => ({
  type: SELECT_CUSTOMERS,
  customers
})

export const toggleCustomer = customerId => ({
  type: TOGGLE_SELECT_CUSTOMER,
  customerId
})

export const selectCluster = (cluster, customers, selectedCustomerIds) => {
  const fakeMarkers = customers.map(customer => ({
    ...customer,
    getPosition: function() {return customer.location}
  }))

  const markersInCluster = fakeMarkers.filter(marker =>
    cluster.isMarkerInClusterBounds(marker))

  const allMarkersSelected = markersInCluster.reduce((acc, m) =>
    selectedCustomerIds.find(id => String(id) === m.id) ? acc : false
  , true)

  const transform = allMarkersSelected ? difference : union

  return selectCustomers(transform(
    selectedCustomerIds,
    markersInCluster.map(marker => marker.id)
  ))
}

export const assignCustomers = (customerIds, driverId) => dispatch => {
  const body = {customerIds, driverId}
  dispatch({type: ASSIGN_REQUEST})
  callApi('admin/customers/assign', 'POST', body)
    .then(res => {
      dispatch({
        type: ASSIGN_SUCCESS,
        response: {
          entities: {
            customers: normalize(res.customers, arrayOfCustomers).entities.customers,
            volunteers: normalize(res.driver, volunteer).entities.volunteers
          }
        }
      })
      dispatch(setFilter(driverId))
    })
    .catch(error => dispatch({type: ASSIGN_FAILURE, error}))
}

export default (state = {
  selectedCustomers: [],
  selectedDriver: '',
  selectedFilter: 'unassigned',
  fetching: false,
  error: null
}, action) => {
  switch (action.type) {
    case SET_FILTER:
      return {
        ...state,
        selectedFilter: action.filter
      }
    case SET_DRIVER:
      return {
        ...state,
        selectedDriver: action.driverId
      }
    case SELECT_CUSTOMERS:
      return {
        ...state,
        selectedCustomers: action.customers.map(customerOrId =>
          customerOrId.id || customerOrId)
      }
    case TOGGLE_SELECT_CUSTOMER: {
      const selectedCustomers = state.selectedCustomers.find(id =>
          id === action.customerId) ?
        state.selectedCustomers.filter(id => id !== action.customerId) :
        [...state.selectedCustomers, action.customerId]

      return {
        ...state,
        selectedCustomers
      }
    }
    case ASSIGN_REQUEST:
      return {
        ...state,
        fetching: true,
        error: null
      }
    case ASSIGN_SUCCESS:
      return {
        ...state,
        fetching: false,
        error: null
      }
    case ASSIGN_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.error
      }
    default: return state
  }
}

export const createSelectors = (path, customerSelectors) => {
  const getFilter = state => get(state, path).selectedFilter
  const getSelectedCustomerIds = state => get(state, path).selectedCustomers

  return {
    getFilter,
    getDriverId: state => get(state, path).selectedDriver,
    getSelectedCustomerIds,
    getFilteredCustomers: createSelector(
      getFilter,
      state => customerSelectors.getAll(state),
      (filter, customers) =>
        customers.filter(customer => {
          if (!filter) return true
          if (filter === 'unassigned') return !customer.assignedTo
          return String(get(customer.assignedTo, 'id')) === filter
        })
    ),
    isCustomerSelected: state => id => createSelector(
      getSelectedCustomerIds,
      customers => !!customers.find(customerId => customerId === id)
    )(state),
    isFetching: state => get(state, path).fetching,
    hasError: state => get(state, path).error
  }
}
