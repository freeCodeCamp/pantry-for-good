import Router from 'express-promise-router'
import multer from 'multer'
import {last} from 'lodash'

import mediaController from '../controllers/media'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const mediaRoot = process.env.NODE_ENV === 'production' ? 'dist/client' : 'assets'
    cb(null, `${mediaRoot}/media`)
  },
  filename: function (req, file, cb) {
    const ext = last(file.originalname.split('.'))
    cb(null, `${file.fieldname}.${ext}`)
  }
})

const upload = multer({storage})

export default () => {
  const mediaRouter = Router({mergeParams: true})

  mediaRouter.route('/admin/media/upload')
    .post(upload.fields([
      {name: 'logo', maxCount: 1},
      {name: 'signature', maxCount: 1}
    ]), mediaController.upload)

  mediaRouter.route('/media')
    .get(mediaController.read)

  return mediaRouter
}
