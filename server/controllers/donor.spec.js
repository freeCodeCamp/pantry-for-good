const sinon = require('sinon')
const sandbox = sinon.createSandbox()
import Donor from '../models/donor'
import User from '../models/user'
import donorCtrl from './donor'

describe('Donor controller', function() {
  let res = {}
  const dummyDonorId = 99999

  before(function() {

  })

  after(function() {

  })

  describe('create', function() {
    let req = {}
    const currTs = Date.now
    let dummyDonor = null
    let donorSaveStub = null
    let userFindOneAndUpdateStub = null

    beforeEach(function() {  	
      req = {
        body: {
          firstName: 'user',
          lastName: 'test',
          email: 'user@test.com',
          created: currTs,
          _id: dummyDonorId,
          __v: 0
        },
        user: {
          firstName: 'user',
          lastName: 'test',
          created: currTs,
          _id: dummyDonorId,
          email: 'user@test.com',
          __v: 0
        }
      }
      res = {
        json: sandbox.spy()
      }

      dummyDonor = {
        donations: [],
        firstName: 'user',
        lastName: 'test',
        email: 'user@test.com',
        _id: dummyDonorId,
        __v: 0,
        fields: [],
        dateReceived: currTs
      }

      donorSaveStub = sandbox.stub(Donor.prototype, 'save').returns(dummyDonor)
      userFindOneAndUpdateStub = sandbox.stub(User, 'findOneAndUpdate')

      donorCtrl.__Rewire__('updateLinkedFields', {
        updateFields: () => { }
      })      
    })

    afterEach(function() {
      req = {}
      res = {}
      donorCtrl.__ResetDependency__('updateLinkedFields')
      sandbox.restore()
    })

    it('should save the newly created donor', async function() {
      await donorCtrl.create(req, res)

      sinon.assert.calledOnce(donorSaveStub)
    })

    it('should update user info associated with the newly created donor', async function() {
      await donorCtrl.create(req, res)

      sinon.assert.calledOnce(userFindOneAndUpdateStub)
    })

    it('should return newly created donor in json', async function() {
      await donorCtrl.create(req, res)

      sinon.assert.calledWith(res.json, sinon.match({ _id: dummyDonorId }))
    })
  })

  describe('read', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should return requested donor object', function() {
      const dummyDonor = {
        _id: dummyDonorId
      }
      const req = {
        donor: dummyDonor
      }
      const res = {
        json: sandbox.spy()
      }

      donorCtrl.read(req, res)

      sinon.assert.calledWith(res.json, sinon.match({ _id: dummyDonorId }))
    })
  })

  describe('update', function() {
    let req = {}
    let res = {}
    let donorSaveStub = null

    beforeEach(function() {
      req = {
        donor: {
          donations: [],
          fields: [],
          _id: dummyDonorId,
          firstName: 'user',
          lastName: 'test',
          email: 'user@test.com',
          __v: 0
        },
        body: {
          donations: [],
          firstName: 'updated',
          lastName: 'test',
          email: 'user@test.com',
          _id: dummyDonorId,
          __v: 0,
          fields: [],
          fullName: 'user test'
        }
      }
      res = {
        json: sandbox.spy()
      }
      const dummyDonor = {
        _id: dummyDonorId
      }

      donorSaveStub = sandbox.stub(Donor.prototype, 'save').returns(dummyDonor)
      donorCtrl.__Rewire__('updateLinkedFields', {
        updateFields: () => { }
      })
    })

    afterEach(function() {
      req = {}
      res = {}
      donorSaveStub = null
      donorCtrl.__ResetDependency__('updateLinkedFields')
      sandbox.restore()
    })

    it('should save requested donor', async function() {
      await donorCtrl.update(req, res)

      sinon.assert.calledOnce(donorSaveStub)
    })

    it('should return saved donor', async function() {
      await donorCtrl.update(req, res)

      sinon.assert.calledWith(res.json, sinon.match({ _id: dummyDonorId }))
    })
  })

  describe('list', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should return requested donor', async function() {
      const req = {}
      const res = {
        json: sandbox.spy()
      }
      const dummyDonor = {
        _id: dummyDonorId,
        donations: []
      }
      const mockFind = {
        sort: sandbox.stub().returnsThis,
        populate: sandbox.stub().returns(dummyDonor)
      }
      sandbox.stub(Donor, 'find').returns(mockFind)

      await donorCtrl.list(req, res)

      sinon.assert.calledWith(res.json, sinon.match({ _id: dummyDonorId }))
    })
  })

  describe('delete', function() {
    let req = {}
    let res = {}
    let userFindByIdAndRemoveStub = null
    let donorFindByIdAndRemoveStub = null

    beforeEach(function() {
      req = {
        donor: {
          _id: dummyDonorId
        }
      }
      res = {
        json: sandbox.spy()
      }

      userFindByIdAndRemoveStub = sandbox.stub(User, 'findByIdAndRemove')
      donorFindByIdAndRemoveStub = sandbox.stub(Donor, 'findByIdAndRemove')      
    })

    afterEach(function() {
      req = {}
      res = {}
      sandbox.restore()
    })

    it('should delete requested donor from User and Donor collections', async function() {
      await donorCtrl.delete(req, res)

      sinon.assert.calledOnce(userFindByIdAndRemoveStub)
      sinon.assert.calledOnce(donorFindByIdAndRemoveStub)
    })

    it('should return deleted donor', async function() {
      await donorCtrl.delete(req, res)

      sinon.assert.calledWith(res.json, sinon.match({ _id: dummyDonorId }))      
    })
  })
})