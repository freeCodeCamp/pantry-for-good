import express from 'express'

import * as users from '../controllers/users'
import customerRoutes from './customer'
import donationRoutes from './donation'
import donorRoutes from './donor'
import foodRoutes from './food'
import mediaRoutes from './media'
import packingRoutes from './packing'
import questionnaireRoutes from './questionnaire'
import settingsRoutes from './settings'
import usersRoutes from './users'
import volunteerRoutes from './volunteer'

const adminRole = ['admin']

var apiRouter = express.Router()

export default delay => apiRouter
  .use(loadingSimulator(delay))
  .all('/admin/*', users.hasAuthorization(adminRole))
  .use(customerRoutes())
  .use(donationRoutes)
  .use(donorRoutes())
  .use(foodRoutes())
  .use(mediaRoutes)
  .use(packingRoutes)
  .use(questionnaireRoutes)
  .use(settingsRoutes)
  .use(usersRoutes())
  .use(volunteerRoutes())

function loadingSimulator(time = 0) {
  return (req, res, next) => {
    setTimeout(next, time)
  }
}
