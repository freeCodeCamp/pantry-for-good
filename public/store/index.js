import {combineReducers} from 'redux';
import {router} from 'redux-ui-router';
import merge from 'lodash/merge';

import app from './app'
import auth from './auth';
import customer, {selectors as customerSelectors} from './customer';
import donation, {selectors as donationSelectors} from './donation';
import donor, {selectors as donorSelectors} from './donor';
import field, {selectors as fieldSelectors} from './field';
import foodCategory, {selectors as foodCategorySelectors} from './food-category';
import foodItem, {selectors as foodItemSelectors} from './food-item';
import location, {selectors as locationSelectors} from './location';
import media from './media';
import questionnaire, {selectors as questionnaireSelectors} from './questionnaire';
import section, {selectors as sectionSelectors} from './section';
import settings from './settings';
import volunteer, {selectors as volunteerSelectors} from './volunteer';

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
  app,
  auth,
  customer,
  donation,
  donor,
  field,
  foodCategory,
  foodItem,
  location,
  media,
  questionnaire,
  router,
  section,
  settings,
  volunteer
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
  /**
   * Get all customers assigned to the current user
   */
  getAssignedCustomers: state => customerSelectors.getAll(state.customer.ids, state.entities)
    .filter(customer => customer.assignedTo === state.auth.user._id),
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

  savingField: state => fieldSelectors.saving(state.field),
  saveFieldError: state => fieldSelectors.saveError(state.field),

  getAllFoods: state =>
    foodCategorySelectors.getAll(state.foodCategory.ids, state.entities),
  loadingFoods: state => foodCategorySelectors.loading(state.foodCategory),
  loadFoodsError: state => foodCategorySelectors.loadError(state.foodCategory),

  getAllFoodItems: state => foodItemSelectors.getAll(state.foodItem.ids, state.entities),

  getAddressCoordinates: state => locationSelectors.getAddressCoordinates(state.location),
  getUserCoordinates: state => locationSelectors.getUserCoordinates(state.location),
  loadingAddressLocation: state => locationSelectors.loadingAddressLocation(state.location),
  loadAddressLocationError: state => locationSelectors.loadAddressLocationError(state.location),
  loadingUserLocation: state => locationSelectors.loadingUserLocation(state.location),
  loadUserLocationError: state => locationSelectors.loadUserLocationError(state.location),

  getAllQuestionnaires: state =>
    questionnaireSelectors.getAll(state.questionnaire.ids, state.entities),
  getOneQuestionnaire: state =>
    id => questionnaireSelectors.getOne(id, state.entities),
  loadingQuestionnaires: state =>
    questionnaireSelectors.loading(state.questionnaire),
  loadQuestionnairesError: state =>
    questionnaireSelectors.loadError(state.questionnaire),
  savingQuestionnaires: state =>
    questionnaireSelectors.saving(state.questionnaire),
  saveQuestionnairesError: state =>
    questionnaireSelectors.saveError(state.questionnaire),

  savingSection: state => sectionSelectors.saving(state.section),
  saveSectionError: state => sectionSelectors.saveError(state.section),

  getAllVolunteers: state =>
    volunteerSelectors.getAll(state.volunteer.ids, state.entities),
  getOneVolunteer: state => id => volunteerSelectors.getOne(id, state.entities),
  loadingVolunteers: state => volunteerSelectors.loading(state.volunteer),
  loadVolunteersError: state => volunteerSelectors.loadError(state.volunteer),
  savingVolunteers: state => volunteerSelectors.saving(state.volunteer),
  saveVolunteersError: state => volunteerSelectors.saveError(state.volunteer),
};
