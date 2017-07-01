import {mergeWith} from 'lodash'

export default function entities(state = {
  customers: {},
  donations: {},
  donors: {},
  fields: {},
  foodCategories: {},
  foodItems: {},
  packages: {},
  pages: {},
  questionnaires: {},
  sections: {},
  users: {},
  volunteers: {}
}, action) {
  if (action.response && action.response.entities) {
    // need to overwrite arrays instead of merge or elements can't be deleted
    return mergeWith(
      {},
      state,
      action.response.entities,
      (objVal, srcVal) => Array.isArray(srcVal) ? srcVal : undefined
    )
  }

  return state
}
