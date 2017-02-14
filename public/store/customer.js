import union from 'lodash/union';
import difference from 'lodash/difference';
import {denormalize} from 'normalizr';

import {customer, arrayOfCustomers} from './schemas';
import {CALL_API} from '../middleware/api';

export const LOAD_CUSTOMERS_REQUEST = 'customer/LOAD_CUSTOMERS_REQUEST';
export const LOAD_CUSTOMERS_SUCCESS = 'customer/LOAD_CUSTOMERS_SUCCESS';
export const LOAD_CUSTOMERS_FAILURE = 'customer/LOAD_CUSTOMERS_FAILURE';
export const LOAD_CUSTOMER_REQUEST = 'customer/LOAD_CUSTOMER_REQUEST';
export const LOAD_CUSTOMER_SUCCESS = 'customer/LOAD_CUSTOMER_SUCCESS';
export const LOAD_CUSTOMER_FAILURE = 'customer/LOAD_CUSTOMER_FAILURE';
export const SAVE_CUSTOMER_REQUEST = 'customer/SAVE_CUSTOMER_REQUEST';
export const SAVE_CUSTOMER_SUCCESS = 'customer/SAVE_CUSTOMER_SUCCESS';
export const SAVE_CUSTOMER_FAILURE = 'customer/SAVE_CUSTOMER_FAILURE';
export const DELETE_CUSTOMER_REQUEST = 'customer/DELETE_CUSTOMER_REQUEST';
export const DELETE_CUSTOMER_SUCCESS = 'customer/DELETE_CUSTOMER_SUCCESS';
export const DELETE_CUSTOMER_FAILURE = 'customer/DELETE_CUSTOMER_FAILURE';

export const loadCustomers = () => ({
  [CALL_API]: {
    endpoint: 'admin/customers',
    schema: arrayOfCustomers,
    types: [LOAD_CUSTOMERS_REQUEST, LOAD_CUSTOMERS_SUCCESS, LOAD_CUSTOMERS_FAILURE]
  }
});

export const loadCustomer = id => ({
  [CALL_API]: {
    endpoint: `customer/${id}`,
    schema: customer,
    types: [LOAD_CUSTOMER_REQUEST, LOAD_CUSTOMER_SUCCESS, LOAD_CUSTOMER_FAILURE]
  }
});

export const saveCustomer = customer => ({
  [CALL_API]: {
    endpoint: customer._id ? `customer/${customer._id}` : `customer`,
    method: customer._id ? 'PUT' : 'POST',
    schema: customer,
    types: [SAVE_CUSTOMER_REQUEST, SAVE_CUSTOMER_SUCCESS, SAVE_CUSTOMER_FAILURE]
  }
});

export const deleteCustomer = id => ({
  [CALL_API]: {
    endpoint: `admin/customers/${id}`,
    method: 'DELETE',
    types: [DELETE_CUSTOMER_REQUEST, DELETE_CUSTOMER_SUCCESS, DELETE_CUSTOMER_FAILURE]
  }
});

export default (state = {
  ids: []
}, action) => {
  switch (action.type) {
    case LOAD_CUSTOMERS_REQUEST:
    case LOAD_CUSTOMER_REQUEST:
      return {
        ...state,
        fetching: true,
        saving: false,
        fetchError: null,
        saveError: null
      };
    case SAVE_CUSTOMER_REQUEST:
    case DELETE_CUSTOMER_REQUEST:
      return {
        ...state,
        fetching: false,
        saving: true,
        fetchError: null,
        saveError: null
      };
    case LOAD_CUSTOMERS_SUCCESS:
    case LOAD_CUSTOMER_SUCCESS:
    case SAVE_CUSTOMER_SUCCESS:
    case DELETE_CUSTOMER_SUCCESS:
      const result = Array.isArray(action.response.result) ? action.response.result : [action.response.result];
      return {
        ...state,
        ids: action.type === DELETE_CUSTOMER_SUCCESS ?
                  difference(result, state.ids) :
                  union(result, state.ids),
        fetching: false,
        saving: false
      };
    case LOAD_CUSTOMERS_FAILURE:
    case LOAD_CUSTOMER_FAILURE:
      return {
        ...state,
        fetching: false,
        saving: false,
        fetchError: action.error
      };
    case SAVE_CUSTOMER_FAILURE:
    case DELETE_CUSTOMER_FAILURE:
      return {
        ...state,
        fetching: false,
        saving: false,
        saveError: action.error
      };
    default: return state;
  }
};

export const selectors = {
  getAllCustomers(customers, entities) {
    return denormalize({customers}, {customers: arrayOfCustomers}, entities).customers;
  },
  getCustomerById(id, customers, entities) {
    if (!customers.find(customerId => customerId === id)) return;
    return denormalize({customers: id}, {customers: customer}, entities).customers;
  }
}
