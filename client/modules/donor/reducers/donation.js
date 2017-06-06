import {denormalize} from 'normalizr'
import {createSelector} from 'reselect'
import {get, union} from 'lodash'

import {donation as donationSchema, arrayOfDonations} from '../../../../common/schemas'
import {callApi} from '../../../store/middleware/api'
import {saveDonor} from './donor'

export const SAVE_DONATION_REQUEST = 'donation/SAVE_REQUEST'
export const SAVE_DONATION_SUCCESS = 'donation/SAVE_SUCCESS'
export const SAVE_DONATION_FAILURE = 'donation/SAVE_FAILURE'
export const RECEIPT_DONATION_REQUEST = 'donation/RECEIPT_REQUEST'
export const RECEIPT_DONATION_SUCCESS = 'donation/RECEIPT_SUCCESS'
export const RECEIPT_DONATION_FAILURE = 'donation/RECEIPT_FAILURE'

const saveDonationRequest = () => ({type: SAVE_DONATION_REQUEST})
const receiptDonationRequest = () => ({type: RECEIPT_DONATION_REQUEST})
const receiptDonationSuccess = () => ({type: RECEIPT_DONATION_SUCCESS})

const saveDonationSuccess = result => ({
  type: SAVE_DONATION_SUCCESS,
  response: {
    result: result._id,
    entities: {
      donations: {[result._id]: result},
    }
  }
})

const saveDonationFailure = error => ({
  type: SAVE_DONATION_FAILURE,
  error
})

const receiptDonationFailure = error => ({
  type: RECEIPT_DONATION_FAILURE,
  error
})

export const saveDonation = (donation, donor) =>
  dispatch => {
    dispatch(saveDonationRequest())
    callApi('admin/donations', 'POST', donation)
      .then(res => {
        dispatch(saveDonor({
          ...donor,
          donations: [...donor.donations, res]
        }, true))

        dispatch(saveDonationSuccess(res))
      })
      .catch(err => dispatch(saveDonationFailure(err)))
  }

export const sendReceipt = (donation, donorId) =>
  dispatch => {
    dispatch(receiptDonationRequest())
    callApi(`admin/donations/${donorId}`, 'PUT', donation)
      .then(() => dispatch(receiptDonationSuccess()))
      .catch(err => dispatch(receiptDonationFailure(err)))
  }

export default (state = {
  ids: []
}, action) => {
  switch (action.type) {
    case SAVE_DONATION_REQUEST:
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
        ids: union(state.ids, [action.response.result])
      }
    case RECEIPT_DONATION_SUCCESS:
      return {
        ...state,
        saving: false,
      }
    case SAVE_DONATION_FAILURE:
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
        denormalize({donationss: id}, {donations: donationSchema}, entities).donations
    )(state),
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
