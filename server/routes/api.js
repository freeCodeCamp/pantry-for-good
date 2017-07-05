import express from 'express'

import {NotFoundError, SimulatedError} from '../lib/errors'
import {ADMIN_ROLE} from '../../common/constants'
import users from '../controllers/users'
import customerRoutes from './customer'
import donationRoutes from './donation'
import donorRoutes from './donor'
import foodRoutes from './food'
import deliveryRoutes from './delivery'
import mediaRoutes from './media'
import packingRoutes from './packing'
import pageRoutes from './page'
import questionnaireRoutes from './questionnaire'
import settingsRoutes from './settings'
import usersRoutes from './users'
import volunteerRoutes from './volunteer'

var apiRouter = express.Router()

export default (delay, errorProb) => apiRouter
  // delay api requests
  .use(loadingSimulator(delay))
  .all('/admin/*', users.hasAuthorization([ADMIN_ROLE]))
  // uncomment to also test core components
  // .use(errorSimulator(errorProb))
  .use(usersRoutes())
  .use(deliveryRoutes())
  .use(pageRoutes())
  .use(mediaRoutes())
  .use(settingsRoutes())
  // for testing non-core components
  .use(errorSimulator(errorProb))
  .use(customerRoutes())
  .use(donationRoutes)
  .use(donorRoutes())
  .use(foodRoutes())
  .use(packingRoutes)
  .use(questionnaireRoutes())
  .use(volunteerRoutes())
  .all('*', () => {
    throw new NotFoundError
  })

function loadingSimulator(time = 0) {
  return (req, res, next) => {
    setTimeout(next, time)
  }
}

function errorSimulator(chance = 0) {
  return (req, res, next) => {
    if (Math.random() < chance) {
      throw new SimulatedError
    }
    next()
  }
}
