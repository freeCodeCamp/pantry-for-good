import Router from 'express-promise-router'
import shiftsController from '../controllers/shift.js'
import usersController from '../controllers/users.js'

const {requiresLogin} = usersController

export default () => {
    const shiftsRouter = Router({mergeParams: true})

    shiftsRouter.route('/shifts')
      .get(requiresLogin, shiftsController.query)

    shiftsRouter.route('admin/shift/new')
      .post(requiresLogin, shiftsController.hasAuthorization, shiftsController.create)

    shiftsRouter.route('/admin/shifts/:shiftId')
      .put(shiftsController.assign)
      .delete(requiresLogin, shiftsController.hasAuthorization, shiftsController.delete)

    shiftsRouter.route('/admin/shifts')
      .get(shiftsController.query)

    shiftsRouter.param('shiftId', shiftsController.shiftById)
}