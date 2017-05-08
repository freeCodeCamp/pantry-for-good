import {combineReducers} from 'redux'
import {routerReducer as router} from 'react-router-redux'
import {reducer as form} from 'redux-form'

import app from '../modules/core/app-reducers'
import auth from '../modules/users/auth-reducer'
import customer from '../modules/customer/customer-reducer'
import donation from '../modules/donor/donation-reducer'
import donor from '../modules/donor/donor-reducer'
import delivery from '../modules/driver/reducers/delivery'
import entities from './entities'
import foodCategory from '../modules/food/food-category-reducer'
import foodItem from '../modules/food/food-item-reducer'
import location from '../modules/driver/reducers/location'
import media from '../modules/media/media-reducer'
import packing from '../modules/food/packing-reducer'
import questionnaire from '../modules/questionnaire/reducers/questionnaire-api'
import questionnaireEditor from '../modules/questionnaire/reducers/questionnaire-editor'
import settings from '../modules/settings/settings-reducer'
import volunteer from '../modules/volunteer/volunteer-reducer'

export default combineReducers({
  entities,
  app,
  auth,
  customer,
  donation,
  donor,
  delivery,
  foodCategory,
  foodItem,
  form,
  location,
  media,
  packing,
  questionnaire,
  questionnaireEditor,
  router,
  settings,
  volunteer
})
