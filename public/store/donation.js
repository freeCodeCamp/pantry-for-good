import {denormalize} from 'normalizr';
import union from 'lodash/union';

import {donation as donationSchema, arrayOfDonations} from './schemas';
import {callApi} from '../middleware/api';
import {saveDonor} from './donor';

export const SAVE_DONATION_REQUEST = 'donation/SAVE_REQUEST';
export const SAVE_DONATION_SUCCESS = 'donation/SAVE_SUCCESS';
export const SAVE_DONATION_FAILURE = 'donation/SAVE_FAILURE';

const saveDonationRequest = () => ({type: SAVE_DONATION_REQUEST});

const saveDonationSuccess = result => ({
  type: SAVE_DONATION_SUCCESS,
  response: {
    result: result._id,
    entities: {
      donations: {[result._id]: result},
    }
  }
});

const saveDonationFailure = error => ({
  type: SAVE_DONATION_FAILURE,
  error
});

export const saveDonation = (donation, donor) =>
  dispatch => {
    dispatch(saveDonationRequest());
    callApi('admin/donations', 'POST', donation)
      .then(res => {
        dispatch(saveDonor({
          ...donor,
          donations: [...donor.donations, res]
        }, true));

        dispatch(saveDonationSuccess(res));
      })
      .catch(err => dispatch(saveDonationFailure(err)));
  };

export default (state = {
  ids: []
}, action) => {
  switch (action.type) {
    case SAVE_DONATION_REQUEST:
      return {
        ...state,
        saving: true,
        saveError: null
      };
    case SAVE_DONATION_SUCCESS:
      return {
        ...state,
        saving: false,
        ids: union([action.response.result], state.ids)
      };
    case SAVE_DONATION_FAILURE:
      return {
        ...state,
        saving: false,
        saveError: action.error
      };
    default: return state;
  }
};

export const selectors = {
  getAll(donations, entities) {
    return denormalize({donations}, {donations: arrayOfDonations}, entities).donations;
  },
  getOne(id, entities) {
    return denormalize({donationss: id}, {donations: donationSchema}, entities).donations;
  },
  saving(donations) {
    return donations.saving
  },
  saveError(donations) {
    return donations.saveError
  }
}
