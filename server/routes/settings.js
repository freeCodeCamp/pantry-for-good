import Router from 'express-promise-router'

import settingsController  from '../controllers/settings'

export default () => {
  const settingsRouter = Router({mergeParams: true})

  settingsRouter.route('/settings')
    .post(settingsController.save)
    .get(settingsController.read)

  return settingsRouter
}
