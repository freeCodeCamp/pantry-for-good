import {get} from 'lodash'

export const SHOW_DIALOG = 'app/dialog/SHOW_DIALOG'
export const HIDE_DIALOG = 'app/dialog/HIDE_DIALOG'

/**
 * @typedef {Object} Action
 * @prop {function} action
 * @prop {string} style
 * @prop {string} text
 *
 * @typedef {Object} Dialog
 * @prop {string} header
 * @prop {string} message
 * @prop {Action[]} actions
 *
 * @param {Dialog} dialog
 */
export const showDialog = dialog => ({
  type: SHOW_DIALOG,
  dialog
})

/**
 * @param {function} cancelAction
 * @param {function} confirmAction
 */
export const showNavDialog = (cancelAction, confirmAction) =>
  showDialog({
    header: 'Are you sure?',
    message: 'Your changes will be lost',
    actions: [{
      style: 'primary',
      text: 'Cancel',
      action: cancelAction
    }, {
      style: 'danger',
      text: 'Leave',
      onClick: confirmAction
    }]
  })

/**
 * @param {function} cancelAction
 * @param {function} confirmAction
 * @param {string} message
 * @param {string} confirmLabel
 */
export const showConfirmDialog = (cancelAction, confirmAction, message, confirmLabel) =>
  showDialog({
    header: 'Are you sure?',
    message,
    actions: [{
      style: 'primary',
      text: 'Cancel',
      action: cancelAction
    }, {
      style: 'danger',
      text: confirmLabel,
      onClick: confirmAction
    }]
  })

export const hideDialog = () => ({
  type: HIDE_DIALOG
})

export default (state = {visible: false}, action) => {
  switch(action.type) {
    case SHOW_DIALOG:
      return {
        visible: true,
        dialog: action.dialog
      }
    case HIDE_DIALOG:
      return {
        ...state,
        visible: false
      }
    default: return state
  }
}

export const createSelectors = path => ({
  isVisible: state => get(state, path).visible,
  getDialog: state => get(state, path).dialog
})
