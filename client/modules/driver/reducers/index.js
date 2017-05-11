import {combineReducers} from 'redux'

import location, {createSelectors as createLocationSelectors} from './location'
import assignment, {createSelectors as createAssignmentSelectors} from './assignment'
import route, {createSelectors as createRouteSelectors} from './route'

export default combineReducers({location, assignment, route})

export const createSelectors = (path, customerSelectors) => ({
  location: createLocationSelectors(`${path}.location`),
  assignment: createAssignmentSelectors(`${path}.assignment`, customerSelectors),
  route: createRouteSelectors(`${path}.route`)
})
