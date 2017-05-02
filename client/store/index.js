import {createStore, applyMiddleware, compose} from 'redux'
import {routerMiddleware as createRouterMiddleware} from 'react-router-redux'
import thunk from 'redux-thunk'
import {createSelector} from 'reselect'
import {flatMap} from 'lodash'

import apiMiddleware from './middleware/api'
import reducer from './reducer'
import {selectors as customerSelectors} from '../modules/customer/customer-reducer'
import {selectors as donationSelectors} from '../modules/donor/donation-reducer'
import {selectors as donorSelectors} from '../modules/donor/donor-reducer'
import {selectors as foodCategorySelectors} from '../modules/food/food-category-reducer'
import {selectors as foodItemSelectors} from '../modules/food/food-item-reducer'
import {selectors as locationSelectors} from '../modules/driver/location-reducer'
import {selectors as questionnaireSelectors} from '../modules/questionnaire/reducers/questionnaire-api'
import {selectors as qEditorSelectors} from '../modules/questionnaire/reducers/questionnaire-editor'
import {selectors as volunteerSelectors} from '../modules/volunteer/volunteer-reducer'

/**
 * Create redux store
 * @param {History} history
 */
export default history => {
  const routerMiddleware = createRouterMiddleware(history)
  const middleware = [thunk, routerMiddleware, apiMiddleware]

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const enhancers = composeEnhancers(applyMiddleware(...middleware))

  const store = createStore(reducer, enhancers)

  if(module.hot) {
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
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

  getSectionIds: state => qEditorSelectors.getSectionIds(state.questionnaireEditor),
  getFieldIds: state => sectionId => qEditorSelectors.getFieldIds(state.questionnaireEditor, sectionId),
  getSectionById: state => id => qEditorSelectors.getSectionById(state.questionnaireEditor, id),
  getFieldById: state => id => qEditorSelectors.getFieldById(state.questionnaireEditor, id),
  getEditingQuestionnaire: state => qEditorSelectors.getEditingQuestionnaire(state.questionnaireEditor),
  getEditingSection: state => qEditorSelectors.getEditingSection(state.questionnaireEditor),
  getEditingField: state => qEditorSelectors.getEditingField(state.questionnaireEditor),
  getSelectedSection: state => qEditorSelectors.getSelectedSection(state.questionnaireEditor),
  getCompleteQuestionnaire: state => qEditorSelectors.getCompleteQuestionnaire(state.questionnaireEditor),

  getAllVolunteers: state =>
    volunteerSelectors.getAll(state.volunteer.ids, state.entities),
  getOneVolunteer: state => id => volunteerSelectors.getOne(id, state.entities),
  getAllDrivers: createSelector(
    state => volunteerSelectors.getAll(state.volunteer.ids, state.entities),
    volunteers => volunteers.filter(v => v.driver && v.status === 'Active')
  ),
  loadingVolunteers: state => volunteerSelectors.loading(state.volunteer),
  loadVolunteersError: state => volunteerSelectors.loadError(state.volunteer),
  savingVolunteers: state => volunteerSelectors.saving(state.volunteer),
  saveVolunteersError: state => volunteerSelectors.saveError(state.volunteer)
}
