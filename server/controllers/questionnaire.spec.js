const sinon = require('sinon')
const sandbox = sinon.createSandbox()
const mongoose = require('mongoose')
import questionnaireCtrl from './questionnaire'
import Questonnaire from '../models/questionnaire'

describe('Questonnaire controller', function() {
  describe('create', function() {
    let req = {}
    let res = {}

    beforeEach(function() {
      req = {
        body: {
          name: 'q1'
        }
      }
      res = {
        json: sandbox.spy()
      }
    })

    afterEach(function() {
      req = {}
      res = {}
      sandbox.restore()
    })

    it('should save requested questionnaire', async function() {
      const dummySavedQuestionnaire = {
        name: 'q1'
      }
      const questionnaireSaveStub = sandbox.stub(Questonnaire.prototype, 'save').returns(dummySavedQuestionnaire)

      await questionnaireCtrl.create(req, res)

      expect(questionnaireSaveStub.calledOnce).to.be.true
    })
    it('should return saved questionnaire', async function() {
      const dummySavedQuestionnaire = {
        name: 'q1'
      }
      sandbox.stub(Questonnaire.prototype, 'save').returns(dummySavedQuestionnaire)

      await questionnaireCtrl.create(req, res)

      expect(res.json.calledWith(sinon.match({ name: dummySavedQuestionnaire.name }))).to.be.true
    })
  })

  describe('update', function() {
    let req = {}
    let res = {}

    beforeEach(function() {
      req = {
        questionnaire: {
          _id: mongoose.Types.ObjectId('5cadc724161c7150fddce1f4')
        },
        body: {}
      }
      res = {
        json: sandbox.spy()
      }
    })

    afterEach(function() {
      sandbox.restore()
    })

    it('should update a requested questionnaire', async function() {
      const dummySavedQuestionnaire = {
        name: 'q1'
      }    	
      const questionnaireSaveStub = sandbox.stub(Questonnaire.prototype, 'save').returns(dummySavedQuestionnaire)

      await questionnaireCtrl.update(req, res)

      expect(questionnaireSaveStub.calledOnce).to.be.true
    })
    it('should return saved questionnaire', async function() {
      const dummySavedQuestionnaire = {
        name: 'q1'
      }    	
      sandbox.stub(Questonnaire.prototype, 'save').returns(dummySavedQuestionnaire)

      await questionnaireCtrl.update(req, res)

      expect(res.json.calledWith(sinon.match({ name: dummySavedQuestionnaire.name })))
    })
  })

  describe('query', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should return all questionnaires', async function() {
      const req = {}
      const res = {
        json: sandbox.spy()
      }
      const expectedQuestionnaires = [{
        name: 'q1'
      }]
      sandbox.stub(Questonnaire, 'find').returns(expectedQuestionnaires)

      await questionnaireCtrl.query(req, res)

      expect(res.json.calledWith(sinon.match({ name: expectedQuestionnaires.name })))
    })
  })

  describe('get', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should return requested questionnaire', async function() {
      const req = {
        questionnaire: 'q1'
      }
      const res = {
        json: sandbox.spy()
      }
      const expectedQuestionnaires = [{
        name: 'q1'
      }]

      await questionnaireCtrl.get(req, res)

      expect(res.json.calledWith(sinon.match({ name: expectedQuestionnaires.name })))
    })
  })
})