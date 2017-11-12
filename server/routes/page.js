import Router from 'express-promise-router'

import pageController from '../controllers/page'

export default () => {
  const pageRouter = Router({mergeParams: true})

  pageRouter.route('/admin/pages')
    .get(pageController.list)

  pageRouter.route('/admin/pages/:identifier')
    .put(pageController.update)

  pageRouter.route('/pages/:identifier')
    .get(pageController.read)

  pageRouter.param('identifier', pageController.pageByIdentifier)

  return pageRouter
}
