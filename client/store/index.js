import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import {
  routerReducer as router,
  routerMiddleware as createRouterMiddleware
} from 'react-router-redux'
import thunk from 'redux-thunk'
import {reducer as form} from 'redux-form'
import {createSelector} from 'reselect'

import apiMiddleware from './middleware/api'
import app from '../modules/core/app-reducers'
import auth from '../modules/users/auth-reducer'
import customer, {selectors as customerSelectors} from '../modules/customer/customer-reducer'
import donation, {selectors as donationSelectors} from '../modules/donor/donation-reducer'
import donor, {selectors as donorSelectors} from '../modules/donor/donor-reducer'
import entities from './entities'
import foodCategory, {selectors as foodCategorySelectors} from '../modules/food/food-category-reducer'
import foodItem, {selectors as foodItemSelectors} from '../modules/food/food-item-reducer'
import location, {selectors as locationSelectors} from '../modules/driver/location-reducer'
import media from '../modules/media/media-reducer'
import packing from '../modules/food/packing-reducer'
import questionnaire, {selectors as questionnaireSelectors} from '../modules/questionnaire/questionnaire-reducer'
import settings from '../modules/settings/settings-reducer'
import volunteer, {selectors as volunteerSelectors} from '../modules/volunteer/volunteer-reducer'

const rootReducer = combineReducers({
  entities,
  app,
  auth,
  customer,
  donation,
  donor,
  foodCategory,
  foodItem,
  form,
  location,
  media,
  packing,
  questionnaire,
  router,
  settings,
  volunteer
})

/**
 * Create redux store
 * @param {History} history
 */
export default history => {
  const routerMiddleware = createRouterMiddleware(history)
  const middleware = [thunk, routerMiddleware, apiMiddleware]

  const enhancers = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension && __DEVELOPMENT__ ?
          window.devToolsExtension() : f => f
  )

  return createStore(rootReducer, enhancers)
}

export const selectors = {
  // TODO: figure out how to memoize getFoo selectors
  // probably fooSelectors need to be memoized too
  // getFormData: createSelector(
  //   state => fieldSelectors.getAll(state.field.ids, state.entities),
  //   state => foodItemSelectors.getAll(state.foodItem.ids, state.entities),
  //   state => sectionSelectors.getAll(state.section.ids, state.entities),
  //   (fields, foods, sections) => ({fields, foods, sections})
  // ),
  getFormData: (state, questionnaireIdentifier) => ({
    foods: foodItemSelectors.getAll(state.foodItem.ids, state.entities),
    questionnaire: questionnaireSelectors.getOne(questionnaireIdentifier, state.entities)
  }),
  loadingFormData: state =>
    state.questionnaire.fetching || state.foodCategory.fetching,
  loadFormDataError: state =>
    state.questionnaire.fetchError || state.foodCategory.fetchError,

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

  getAllQuestionnaires: createSelector(
    state => questionnaireSelectors.getAll(state.questionnaire.ids, state.entities),
    questionnaires => questionnaires
  ),
  getOneQuestionnaire: state =>
    identifier => questionnaireSelectors.getOne(identifier, state.entities),
  loadingQuestionnaires: state =>
    questionnaireSelectors.loading(state.questionnaire),
  loadQuestionnairesError: state =>
    questionnaireSelectors.loadError(state.questionnaire),
  savingQuestionnaires: state =>
    questionnaireSelectors.saving(state.questionnaire),
  saveQuestionnairesError: state =>
    questionnaireSelectors.saveError(state.questionnaire),

  getAllVolunteers: state =>
    volunteerSelectors.getAll(state.volunteer.ids, state.entities),
  getOneVolunteer: state => id => volunteerSelectors.getOne(id, state.entities),
  loadingVolunteers: state => volunteerSelectors.loading(state.volunteer),
  loadVolunteersError: state => volunteerSelectors.loadError(state.volunteer),
  savingVolunteers: state => volunteerSelectors.saving(state.volunteer),
  saveVolunteersError: state => volunteerSelectors.saveError(state.volunteer),
}
