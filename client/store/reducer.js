import {combineReducers} from 'redux'
import {routerReducer as router} from 'react-router-redux'
import {reducer as form} from 'redux-form'

import app from '../modules/core/reducers'
import auth from '../modules/users/authReducer'
import customer from '../modules/customer/reducer'
import donation from '../modules/donor/reducers/donation'
import donor from '../modules/donor/reducers/donor'
import delivery from '../modules/driver/reducers'
import entities from './entities'
import food from '../modules/food/reducers'
import page from '../modules/page/reducer'
import media from '../modules/settings/reducers/media'
import questionnaire from '../modules/questionnaire/reducers/api'
import questionnaireEditor from '../modules/questionnaire/reducers/editor'
import settings from '../modules/settings/reducers/settings'
import user from '../modules/users/userReducer'
import volunteer from '../modules/volunteer/reducer'

export default combineReducers({
  entities,
  app,
  auth,
  customer,
  donation,
  donor,
  delivery,
  food,
  form,
  media,
  page,
  questionnaire,
  questionnaireEditor,
  router,
  settings,
  user,
  volunteer
})
