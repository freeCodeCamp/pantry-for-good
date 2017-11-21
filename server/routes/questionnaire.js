import Router from 'express-promise-router'

import questionnaireController from '../controllers/questionnaire'
import usersController from '../controllers/users'

const {requiresLogin} = usersController

export default () => {
  const  questionnaireRouter = Router({mergeParams: true})

  questionnaireRouter.use('/questionnaires', requiresLogin)

  questionnaireRouter.route('/questionnaires')
    .get(questionnaireController.query)
    // .post(questionnaireController.create)

  questionnaireRouter.route('/questionnaires/:questionnaireId')
    .get(questionnaireController.get)
    .put(questionnaireController.update)
    // .delete(questionnaireController.delete)

  questionnaireRouter.param('questionnaireId', questionnaireController.questionnaireById)

  return questionnaireRouter
}
