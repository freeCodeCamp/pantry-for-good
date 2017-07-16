import Router from 'express-promise-router'
import {upload} from '../lib/media-helpers'

import mediaController from '../controllers/media'

export default () => {
  const mediaRouter = Router({mergeParams: true})

  mediaRouter.route('/admin/media/upload')
    .post(upload.fields([
      {name: 'logo', maxCount: 1},
      {name: 'signature', maxCount: 1},
      {name: 'favicon', maxCount: 1}
    ]), mediaController.upload)

  mediaRouter.route('/media')
    .get(mediaController.read)

  return mediaRouter
}
