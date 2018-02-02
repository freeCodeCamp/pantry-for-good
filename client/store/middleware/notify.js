import Notify from 'react-s-alert'

import { SAVE_SUCCESS } from '../../modules/settings/reducers/settings'

const successTable = {
  [SAVE_SUCCESS]: 'Settings saved!',
}

const errMsg = (
  '<p>' +
    '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' +
    '&nbsp;Fix form errors before continue' +
  '<p>'
)
const succMsg = msg => (
  '<p>' +
    '<i class="fa fa-check-circle" aria-hidden="true"></i>' +
    `&nbsp;${msg}` +
  '<p>'
)

export default () => next => action => {
  next(action)

  /* error notification check */
  if (action.error) {
    if (action.meta && action.meta.form) Notify.error(errMsg)
    return
  }

  /* success notification check */
  const message = successTable[action.type]

  if (message) {
    Notify.success(succMsg(message))
  }
}
