import {combineReducers} from 'redux';
import {router} from 'redux-ui-router';
import merge from 'lodash/merge';

import auth from './auth';
import customer, {selectors as customerSelectors} from './customer';
import donation, {selectors as donationSelectors} from './donation';
import donor, {selectors as donorSelectors} from './donor';
import field, {selectors as fieldSelectors} from './field';
import foodCategory, {selectors as foodCategorySelectors} from './food-category';
import foodItem, {selectors as foodItemSelectors} from './food-item';
import media from './media';
import questionnaire, {selectors as questionnaireSelectors} from './questionnaire';
import section, {selectors as sectionSelectors} from './section';
import settings from './settings';

// Updates an entity cache in response to any action with response.entities.
const entities = (state = {
  customers: {},
  donations: {},
  donors: {},
  fields: {},
  foodCategories: {},
  foodItems: {},
  questionnaires: {},
  sections: {},
  users: {},
  volunteers: {}
}, action) => {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }

  return state;
};

export default combineReducers({
  entities,
  auth,
  customer,
  donation,
  donor,
  field,
  foodCategory,
  foodItem,
  media,
  questionnaire,
  router,
  section,
  settings
});

export const selectors = {
  getFormData: state => ({
    fields: fieldSelectors.getAll(state.field.ids, state.entities),
    foods: foodItemSelectors.getAll(state.foodItem.ids, state.entities),
    sections: sectionSelectors.getAll(state.section.ids, state.entities)
  }),
  loadingFormData: state =>
    state.field.fetching || state.foodCategory.fetching || state.section.fetching,
  loadFormDataError: state =>
    state.field.fetchError || state.foodCategory.fetchError || state.section.fetchError,

  getAllCustomers: state => customerSelectors.getAll(state.customer.ids, state.entities),
  getOneCustomer: state => id => customerSelectors.getOne(id, state.entities),
  loadingCustomers: state => customerSelectors.loading(state.customer),
  loadCustomersError: state => customerSelectors.loadError(state.customer),
  savingCustomers: state => customerSelectors.saving(state.customer),
  saveCustomersError: state => customerSelectors.saveError(state.customer),

  savingDonations: state => donationSelectors.saving(state.donation),
  saveDonationsError: state => donationSelectors.saveError(state.donation),

  getAllDonors: state => donorSelectors.getAll(state.donor.ids, state.entities),
  getOneDonor: state => id => donorSelectors.getOne(id, state.entities),
  loadingDonors: state => donorSelectors.loading(state.donor),
  loadDonorsError: state => donorSelectors.loadError(state.donor),
  savingDonors: state => donorSelectors.saving(state.donor),
  saveDonorsError: state => donorSelectors.saveError(state.donor),

  getAllFoods: state => foodCategorySelectors.getAll(state.foodCategory.ids, state.entities),
  loadingFoods: state => foodCategorySelectors.loading(state.foodCategory),
  loadFoodsError: state => foodCategorySelectors.loadError(state.foodCategory)
};
