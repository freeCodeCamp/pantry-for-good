import Router from 'express-promise-router'

import usersController from '../controllers/users'
import settingsController  from '../controllers/settings'

const {requiresLogin} = usersController

export default () => {
  const settingsRouter = Router({mergeParams: true})

  settingsRouter.route('/settings')
    .all(requiresLogin)
    .post(settingsController.save)
    .get(settingsController.read)

  return settingsRouter
}
