import {extend} from 'lodash'
import {Questionnaire} from '../models/questionnaire'
import errorHandler from './errors'

// Create questionnaire
exports.create = function(req, res) {
  var questionnaire = new Questionnaire(req.body)

  questionnaire.save(function(err){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    } else {
      res.json(questionnaire)
    }
  })
}

// Update a questionnaire
exports.update = function(req, res) {
  var questionnaire = req.questionnaire
  questionnaire = extend(questionnaire, req.body)
  delete questionnaire.__v

  console.log('questionnaire', questionnaire)


  questionnaire.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    } else {
      res.json(questionnaire)
    }
  })
}

// Delete a questionnaire
exports.delete = function(req, res) {
  var questionnaire = req.questionnaire

  // Prevent remove if there are sections for the questionnaire
  if (questionnaire.sections.length) {
    return res.status(400).send({
      message: 'Questionnaire must not contain any sections before deleting'
    })
  }

  questionnaire.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    } else {
      res.json(questionnaire)
    }
  })
}

// Query questionnaires
exports.query = function(req, res) {
  Questionnaire.find({}, function(err, questionnaires) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    } else {
      res.json(questionnaires)
    }
  })
}

// Get specified questionnaire
exports.get = function(req, res) {
  res.json(req.questionnaire)
}

// Questionnaire middleware
exports.questionnaireById = function(req, res, next, id) {
  // Make sure id is a valid ObjectId before proceeding
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(404).send({
      message: 'Invalid questionnaire id'
    })
    return next()
  }

  Questionnaire.findById(id)
    .exec()
    .then(function(questionnaire) {
      if (!questionnaire) {
        return res.status(404).send({
          message: 'Questionnaire not found'
        })
      }
      req.questionnaire = questionnaire
      return questionnaire
    })
    .catch(function(err) {
      res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
      return err
    })
  .asCallback(next)
}
