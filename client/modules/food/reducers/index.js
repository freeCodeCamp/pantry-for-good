import {combineReducers} from 'redux'

import item, {createSelectors as createItemSelectors} from './item'
import category, {createSelectors as createCategorySelectors} from './category'
import packing, {createSelectors as createPackingSelectors} from './packing'

export default combineReducers({item, category, packages: packing})

export const createSelectors = path => ({
  item: createItemSelectors(`${path}.item`),
  category: createCategorySelectors(`${path}.category`),
  packing: createPackingSelectors(`${path}.packages`)
})
