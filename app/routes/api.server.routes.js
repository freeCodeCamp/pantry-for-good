import express from 'express'

import * as users from '../controllers/users.server.controller'
import customerRoutes from './customer.server.routes'
import donationRoutes from './donation.server.routes'
import donorRoutes from './donor.server.routes'
import foodRoutes from './food.server.routes'
import mediaRoutes from './media.server.routes'
import packingRoutes from './packing.server.routes'
import questionnaireRoutes from './questionnaire.server.routes'
import settingsRoutes from './settings.server.routes'
import usersRoutes from './users.server.routes'
import volunteerRoutes from './volunteer.server.routes'

const adminRole = ['admin']

var apiRouter = express.Router();

export default () => apiRouter
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
