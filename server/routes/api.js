import express from 'express'

import * as users from '../controllers/users'
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

const adminRole = ['admin']

var apiRouter = express.Router()

export default (delay, errorProb) => apiRouter
  // delay api requests
  .use(loadingSimulator(delay))
  .all('/admin/*', users.hasAuthorization(adminRole))
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
  .all('*', (req, res) => res.status(404).json({
    message: 'Not found'
  }))

function loadingSimulator(time = 0) {
  return (req, res, next) => {
    setTimeout(next, time)
  }
}

function errorSimulator(chance = 0) {
  return (req, res, next) => {
    if (Math.random() < chance) {
      throw new Error('boom')
    }
    next()
  }
}
