import {combineReducers} from 'redux'

import location, {createSelectors as createLocationSelectors} from './location'
import assignment, {createSelectors as createAssignmentSelectors} from './assignment'
import route, {createSelectors as createRouteSelectors} from './route'

export default combineReducers({location, assignment, route})

export const createSelectors = (path, ...args) => ({
  location: createLocationSelectors(`${path}.location`),
  assignment: createAssignmentSelectors(`${path}.assignment`, ...args),
  route: createRouteSelectors(`${path}.route`)
})
