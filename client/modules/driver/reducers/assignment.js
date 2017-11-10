import {difference, get, union} from 'lodash'
import {createSelector} from 'reselect'
import {normalize} from 'normalizr'

import {callApi} from '../../../store/middleware/api'
import {arrayOfCustomers, arrayOfVolunteers} from '../../../../common/schemas'

export const SET_FILTER = 'delivery/assignment/SET_FILTER'
export const SET_DRIVER = 'delivery/assignment/SET_DRIVER'
export const SELECT_CUSTOMERS = 'delivery/assignment/SELECT_CUSTOMERS'
export const TOGGLE_SELECT_CUSTOMER = 'delivery/assignment/TOGGLE_CUSTOMER'
export const ASSIGN_REQUEST = 'delivery/assignment/ASSIGN_REQUEST'
export const ASSIGN_SUCCESS = 'delivery/assignment/ASSIGN_SUCCESS'
export const ASSIGN_FAILURE = 'delivery/assignment/ASSIGN_FAILURE'

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

  const bound = cluster.getBounds()
  const markersInCluster = customers.filter(customer => bound.contains(customer.location))

  const allMarkersSelected = markersInCluster.reduce((acc, m) =>
    selectedCustomerIds.find(id => id === m._id) ? acc : false
    , true)

  const transform = allMarkersSelected ? difference : union

  return selectCustomers(transform(
    selectedCustomerIds,
    markersInCluster.map(marker => marker._id)
  ))
}

export const assignCustomers = (customerIds, driverId) => dispatch => {
  const body = {customerIds, driverId}
  dispatch({type: ASSIGN_REQUEST})

  return callApi('admin/delivery/assign', 'POST', body)
    .then(res => {
      dispatch({
        type: ASSIGN_SUCCESS,
        response: normalize(res, {
          customers: arrayOfCustomers,
          volunteers: arrayOfVolunteers
        })
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
          customerOrId._id || customerOrId)
      }
    case TOGGLE_SELECT_CUSTOMER: {
      const selectedCustomers = state.selectedCustomers.find(
        id => id === action.customerId
      ) ?
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
          return String(get(customer.assignedTo, '_id')) === String(filter)
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
