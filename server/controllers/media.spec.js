const sinon = require('sinon')
const sandbox = sinon.createSandbox()
import mediaCtrl from './media'
import Media from '../models/media'

describe('Media controller', function() {
  describe('read', function() {
    let req = {}
    let res = {}

    beforeEach(function() {
      req = {}
      res = {
        json: sandbox.spy()
      }
    })

    afterEach(function() {
      req = {}
      res = {}
      sandbox.restore()
    })

    it('should return requested media object if requested media object can be found in media collection', async function() {
      const dummyModelId = 99999
      const dummyModel = {
        _id: dummyModelId,
        path: 'media/',
        logo: 'logo.png'
      }
      const mediaFindOneStub = sandbox.stub(Media, 'findOne').returns(dummyModel)

      await mediaCtrl.read(req, res)

      sinon.assert.calledOnce(mediaFindOneStub)
      sinon.assert.calledWith(res.json, sinon.match({ _id: dummyModelId }))
    })

    it('should should return requested media object if requested media object cannot be found in media collection', async function() {
      const defaultModel = {
        _id: 99999,
        path: 'media/',
        logo: 'logo.png'
      }    	
      const mediaFindOneStub = sandbox.stub(Media, 'findOne').returns(null)

      await mediaCtrl.read(req, res)

      sinon.assert.calledOnce(mediaFindOneStub)
      sinon.assert.calledWith(res.json, sinon.match({ path: defaultModel.path, logo: defaultModel.logo }))
    })
  })

  describe('upload', function() {
    it('should delete requested files from requested media object')
  })
})