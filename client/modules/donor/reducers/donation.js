import {denormalize} from 'normalizr'
import {createSelector} from 'reselect'
import {get, union} from 'lodash'

import {
  donor as donorSchema,
  donation as donationSchema,
  arrayOfDonations
} from '../../../../common/schemas'
import {callApi} from '../../../store/middleware/api'

export const SAVE_DONATION_REQUEST = 'donation/SAVE_REQUEST'
export const SAVE_DONATION_SUCCESS = 'donation/SAVE_SUCCESS'
export const SAVE_DONATION_FAILURE = 'donation/SAVE_FAILURE'
export const APPROVE_DONATION_REQUEST = 'donation/APPROVE_REQUEST'
export const APPROVE_DONATION_SUCCESS = 'donation/APPROVE_SUCCESS'
export const APPROVE_DONATION_FAILURE = 'donation/APPROVE_FAILURE'
export const RECEIPT_DONATION_REQUEST = 'donation/RECEIPT_REQUEST'
export const RECEIPT_DONATION_SUCCESS = 'donation/RECEIPT_SUCCESS'
export const RECEIPT_DONATION_FAILURE = 'donation/RECEIPT_FAILURE'

const saveDonationRequest = () => ({type: SAVE_DONATION_REQUEST})
const approveDonationRequest = () => ({type: APPROVE_DONATION_REQUEST})
const receiptDonationRequest = () => ({type: RECEIPT_DONATION_REQUEST})

const receiptDonationSuccess = response => ({
  type: RECEIPT_DONATION_SUCCESS,
  response
})

const saveDonationSuccess = response => ({
  type: SAVE_DONATION_SUCCESS,
  response
})

const saveDonationFailure = error => ({
  type: SAVE_DONATION_FAILURE,
  error
})

const approveDonationSuccess = response => ({
  type: APPROVE_DONATION_SUCCESS,
  response
})

const approveDonationFailure = error => ({
  type: APPROVE_DONATION_FAILURE,
  error
})

const receiptDonationFailure = error => ({
  type: RECEIPT_DONATION_FAILURE,
  error
})

export const approveDonation = id => dispatch => {
  dispatch(approveDonationRequest())
  return callApi(`admin/donations/${id}/approve`, 'PUT', null, null, donationSchema)
    .then(res => dispatch(approveDonationSuccess(res)))
    .catch(err => dispatch(approveDonationFailure(err)))
}


export const saveDonation = (donation, donor) => dispatch => {
  dispatch(saveDonationRequest())

  const schema = {
    donation: donationSchema,
    donor: donorSchema
  }

  return callApi('donations', 'POST', {...donation, donor: donor._id}, null, schema)
    .then(res => dispatch(saveDonationSuccess(res)))
    .catch(err => dispatch(saveDonationFailure(err)))
}

export const sendReceipt = id => dispatch => {
  dispatch(receiptDonationRequest())
  return callApi(`donations/${id}`, 'PUT', null, null, donationSchema)
    .then(res => dispatch(receiptDonationSuccess(res)))
    .catch(err => dispatch(receiptDonationFailure(err)))
}

export default (state = {
  ids: []
}, action) => {
  switch (action.type) {
    case SAVE_DONATION_REQUEST:
    case APPROVE_DONATION_REQUEST:
    case RECEIPT_DONATION_REQUEST:
      return {
        ...state,
        saving: true,
        saveError: null
      }
    case SAVE_DONATION_SUCCESS:
      return {
        ...state,
        saving: false,
        ids: union(state.ids, [action.response.result.donations])
      }
    case APPROVE_DONATION_SUCCESS:
    case RECEIPT_DONATION_SUCCESS:
      return {
        ...state,
        saving: false,
      }
    case SAVE_DONATION_FAILURE:
    case APPROVE_DONATION_FAILURE:
    case RECEIPT_DONATION_FAILURE:
      return {
        ...state,
        saving: false,
        saveError: action.error
      }
    default: return state
  }
}

export const createSelectors = path => {
  const getEntities = state => state.entities

  return {
    getAll: createSelector(
      state => get(state, path).ids,
      getEntities,
      (donations, entities) =>
        denormalize({donations}, {donations: arrayOfDonations}, entities).donations
    ),
    getOne: state => id => createSelector(
      getEntities,
      entities =>
        denormalize({donations: id}, {donations: donationSchema}, entities).donations
    )(state),
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
