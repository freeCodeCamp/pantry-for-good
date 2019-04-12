import Router from 'express-promise-router'

import volunteerController from '../controllers/volunteer'
import userController from '../controllers/users'
//import websocketMiddleware from '../lib/websocket-middleware'
//import {volunteer} from '../../common/schemas'

export default () => {
  const {requiresLogin} = userController
  const {hasAuthorization} = volunteerController

  const volunteerRouter = Router({mergeParams: true})

  // Volunteer routes for user
  volunteerRouter.route('/volunteer')
    .post(requiresLogin, volunteerController.create)
  volunteerRouter.route('/volunteer/:volunteerId')
    .get(requiresLogin, hasAuthorization, volunteerController.read)
    .put(requiresLogin, hasAuthorization, volunteerController.update)

  // Updates a shift
  volunteerRouter.route('/volunteers/updateShift')
    .put(volunteerController.updateShift)

  // Volunteer routes for admin for volunteer scheduling
  volunteerRouter.route('/volunteers/addShift')
    .put(volunteerController.addShift)   

  volunteerRouter.route('/volunteers/deleteShift')
    .put(volunteerController.deleteShift) 
    
  // Volunteer routes for admin
  volunteerRouter.route('/admin/volunteers')
    .get(volunteerController.list)
  volunteerRouter.route('/admin/volunteers/:volunteerId')
    .get(volunteerController.read)
    .put(volunteerController.update)
    .delete(volunteerController.delete)

  // Finish by binding the volunteer middleware
  volunteerRouter.param('volunteerId', volunteerController.volunteerById)



  return volunteerRouter
}
