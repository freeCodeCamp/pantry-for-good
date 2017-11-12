import {combineReducers} from 'redux'

import dialog, {createSelectors as createDialogSelectors} from './dialog'
import menu from './menu'

export default combineReducers({
  dialog,
  menu
})

export const createSelectors = path => ({
  dialog: createDialogSelectors(`${path}.dialog`)
})
