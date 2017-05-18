'use strict'
import Media from '../models/media'
/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
    // Media = mongoose.model('Media'),
  fs = require('fs')

/**
 * Read media data
 */
exports.read = function(req, res) {
  Media.findOne({}, function(err, media) {
    if (err) throw err

    if (media) {
      const files = fs.readdirSync("assets/" + media.logoPath)
      if (files.indexOf(media.logoFile) === -1) {
        const file = files.find( file => file.match(/.*\.gif|.*\.jpeg|.*\.png/) )
        if (!file)
          console.log(
            "WARNING: Can't find logo " + media.logoPath + media.logoFile + ".")
        else
          media.logoFile = file
      }
      res.json(media)
    } else {
      res.json(new Media())
    }
  })
}

/**
 * Save media data
 */
exports.save = function(req, res) {
  // If settings object already exist, update, otherwise save
  Media.count({}, function (err, count){
    if (count>0) {
      Media.findByIdAndUpdate(req.body._id, req.body, function(err, media) {
        if (err) throw err
        res.json(media)
      })
    } else {
      var media = new Media(req.body)
      media.save()
    }
  })
}

exports.uploadLogo = function(req, res) {
  Media.findOne({}, function(err, media) {
    if (err) throw err

    if (!media)
      media = new Media()

    media.logoFile = req.file.filename
    media.save()
    res.json(media)
  })
}

