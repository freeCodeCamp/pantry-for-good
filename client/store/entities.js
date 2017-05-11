import merge from 'lodash/merge'

export default function entities(state = {
  customer: {},
  donations: {},
  donors: {},
  fields: {},
  foodCategories: {},
  foodItems: {},
  questionnaires: {},
  sections: {},
  users: {},
  volunteers: {}
}, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }

  return state
}
