import Router from 'express-promise-router'

import questionnaireController from '../controllers/questionnaire'

export default () => {
  const  questionnaireRouter = Router({mergeParams: true})

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
