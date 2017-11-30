import {combineReducers} from 'redux'

import dialog, {createSelectors as createDialogSelectors} from './dialog'

export default combineReducers({
  dialog
})

export const createSelectors = path => ({
  dialog: createDialogSelectors(`${path}.dialog`)
})
