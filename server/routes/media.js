'use strict'

/**
 * Module dependencies
 */
var express = require('express'),
  media = require('../controllers/media'),
  multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/media')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })
var mediaRouter = express.Router({mergeParams: true})

// Media routes
mediaRouter.route('/media/uploadLogo')
  .post(multer({storage:storage}).single('file'), media.uploadLogo)

mediaRouter.route('/media')
  .post(media.save)

mediaRouter.route('/media')
  .get(media.read)

module.exports = mediaRouter
