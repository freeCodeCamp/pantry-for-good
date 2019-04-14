const sinon = require('sinon')
const sandbox = sinon.createSandbox()
import volunteerCtrl from './volunteer'
import Volunteer from '../models/volunteer'
import User from '../models/user'
import {ADMIN_ROLE, clientRoles} from '../../common/constants'

describe('Volunteer controller', function() {
  describe('create', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should update requested volunteer in User collection', async function() {
      const req = {
        body: {},
        user: {
          _id: 99999
        }
      }
      const res = {
        json: sandbox.spy()
      }
      const userFindOneAndUpdateStub = sandbox.stub(User, 'findOneAndUpdate')

      const expectedSavedVolunteer = {
        _id: 99999
      }
      sandbox.stub(Volunteer.prototype, 'save').returns(expectedSavedVolunteer)

      volunteerCtrl.__Rewire__('updateFields', () => {})

      await volunteerCtrl.create(req, res)

      expect(userFindOneAndUpdateStub.calledOnce).to.be.true

      volunteerCtrl.__ResetDependency__('updateFields')
    })

    it('should save requested volunteer in Volunteer collection and return saved volunteer', async function() {
      const req = {
        body: {},
        user: {
          _id: 99999
        }
      }
      const res = {
        json: sandbox.spy()
      }
      sandbox.stub(User, 'findOneAndUpdate')

      const expectedSavedVolunteer = {
        _id: 99999
      }
      const volunteerSaveStub = sandbox.stub(Volunteer.prototype, 'save').returns(expectedSavedVolunteer)

      volunteerCtrl.__Rewire__('updateFields', () => {})

      await volunteerCtrl.create(req, res)

      expect(volunteerSaveStub.calledOnce).to.be.true
      expect(res.json.calledWith(sinon.match(expectedSavedVolunteer)))

      volunteerCtrl.__ResetDependency__('updateFields')
    })
  })

  describe('read', function() {
    let res = {}

    beforeEach(function() {
      res = {
        json: sandbox.spy()
      }
    })

    afterEach(function() {
      sandbox.restore()
    })

    it('should return requested volunteer and associated user roles if requested volunteer has admin role', async function() {
      const req = {
        user: {
          _id: 99999,
          roles: [ clientRoles.VOLUNTEER, ADMIN_ROLE ]      		
        },
        volunteer: {
          _id: 99999,
        }
      }
      const expectedRoles = {
        roles: [ clientRoles.VOLUNTEER, ADMIN_ROLE ]
      }
      const mockUserFindById = {
        findById: sandbox.stub().returnrsThis,
        lean: sandbox.stub().returns(expectedRoles)
      }
      sandbox.stub(User, 'findById').returns(mockUserFindById)

      await volunteerCtrl.read(req, res)

      expect(res.json.calledWith(sinon.match({
        _id: req.volunteer._id,
        roles: req.user.roles
      }))).to.be.true
    })

    it('should return only the requested volunteer and not roles if requested volunteer does not have admin role', async function() {  	
      const req = {
        user: {
          _id: 99999,
          roles: [ clientRoles.VOLUNTEER ]      		
        },
        volunteer: {
          id: 99999,
        }
      }

      await volunteerCtrl.read(req, res)

      expect(res.json.calledWith(sinon.match({
        _id: req.volunteer._id
      }))).to.be.true
      expect(res.json.calledWith(sinon.match.has('roles'))).to.be.false
    })
  })

  describe('update', function() {
    let res = {}

    beforeEach(function() {
      res = {
        json: sandbox.spy()
      }
    })

    afterEach(function() {
      sandbox.restore()
    })

    it('should save requested volunteer and return requested new volunteer if requested volunteer does not have admin role', async function() {
      const req = {
        body: {
          _id: 99999,
          fields: [],
          user: 99999
        },
        volunteer: {
          _id: 99999,
          user: 99999
        },
        user: {
          roles: [ clientRoles.VOLUNTEER ],
          _id: 72769
        }
      }
      const dummyUser = {
        _id: 999999,
        roles: [ clientRoles.VOLUNTEER ]
      }
      const mockUserFindById = {
        findById: sandbox.stub().returnrsThis,
        lean: sandbox.stub().returns(dummyUser)
      }
      sandbox.stub(User, 'findById').returns(mockUserFindById)

      const dummyVolunteer = {
        _id: 99999,
        user: 99999
      }
      const volunteerSaveStub = sandbox.stub(Volunteer.prototype, 'save').returns(dummyVolunteer)

      volunteerCtrl.__Rewire__('updateFields', () => {})

      sandbox.stub(User, 'findByIdAndUpdate')

      await volunteerCtrl.update(req, res)

      expect(volunteerSaveStub.calledOnce).to.be.true
      expect(res.json.calledWith(sinon.match({ _id: dummyVolunteer._id }))).to.be.true

      volunteerCtrl.__ResetDependency__('updateFields')
    })

    it('should return requested volunteer and difference in roles if requested volunteer has admin role', async function() {
      const req = {
        body: {
          _id: 99999,
          fields: [],
          user: 99999,
          roles: [ clientRoles.CUSTOMER, clientRoles.VOLUNTEER, ADMIN_ROLE ]
        },
        volunteer: {
          _id: 99999,
          user: 99999
        },
        user: {
          roles: [ clientRoles.CUSTOMER ],
          _id: 72769
        }
      }
      const dummyUser = {
        _id: 999999,
        roles: [ clientRoles.CUSTOMER ]
      }
      const mockUserFindById = {
        findById: sandbox.stub().returnrsThis,
        lean: sandbox.stub().returns(dummyUser)
      }
      sandbox.stub(User, 'findById').returns(mockUserFindById)

      const dummyVolunteer = {
        _id: 99999,
        user: 99999,
        roles: [ clientRoles.CUSTOMER, clientRoles.VOLUNTEER ]
      }
      const volunteerSaveStub = sandbox.stub(Volunteer.prototype, 'save').returns(dummyVolunteer)

      volunteerCtrl.__Rewire__('updateFields', () => {})

      sandbox.stub(User, 'findByIdAndUpdate')

      await volunteerCtrl.update(req, res)

      expect(volunteerSaveStub.calledOnce).to.be.true
      expect(res.json.calledWith(sinon.match({ _id: dummyVolunteer._id }))).to.be.true
      expect(res.json.calledWith(sinon.match.has('roles'))).to.be.true

      volunteerCtrl.__ResetDependency__('updateFields')      
    })
  })
  
  describe('list', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should return volunteers in Volunteer collection with user roles field', async function() {
      const req = {}
      const res = {
        json: sandbox.spy()
      }    
      const expectedVolunteers = [{
        _id: 99999,
        user: { roles: [ clientRoles.VOLUNTEER ], _id: 99998 } }
      ]
      const mockFind = {
        find: sandbox.stub().returnsThis,
        sort: sandbox.stub().returnsThis,
        populate: sandbox.stub().returns(expectedVolunteers)
      }
      const volunteerListStub = sandbox.stub(Volunteer, 'find').returns(mockFind)

      await volunteerCtrl.list(req, res)

      expect(volunteerListStub.calledOnce).to.be.true
      expect(res.json.calledWith(sinon.match.array)).to.be.true
      expect(res.json.calledWith(sinon.match.every(sinon.match.has('_id')))).to.be.true
      expect(res.json.calledWith(sinon.match.every(sinon.match.hasNested('user.roles')))).to.be.true
    })
  })

  describe('delete', function() {
    let req = {}
    let res = {}

    beforeEach(function() {
      req = {
        volunteer: {
          _id: 99999
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

    it('should delete requested volunteer and return deleted volunteer', async function() {
      const expectedVolunteers = [{
        _id: 99999,
        user: { roles: [ clientRoles.VOLUNTEER ], _id: 99998 }
      }]
      const volunteerFindByIdAndRemoveStub = sandbox.stub(Volunteer, 'findByIdAndRemove').returns(expectedVolunteers)
      sandbox.stub(User, 'findByIdAndRemove')

      await volunteerCtrl.delete(req, res)

      expect(volunteerFindByIdAndRemoveStub.calledOnce).to.be.true
      expect(volunteerFindByIdAndRemoveStub.calledWith(req.volunteer._id)).to.be.true
      expect(res.json.calledWith(sinon.match.array)).to.be.true
      expect(res.json.calledWith(sinon.match.every(sinon.match.has("_id")))).to.be.true
    })

    it('should delete associated user of requested volunteer', async function() {
      const expectedVolunteers = [{
        _id: 99999,
        user: { roles: [ clientRoles.VOLUNTEER ], _id: 99998 }
      }]
      sandbox.stub(Volunteer, 'findByIdAndRemove').returns(expectedVolunteers)
      const userFindByIdAndRemoveStub =  sandbox.stub(User, 'findByIdAndRemove')

      await volunteerCtrl.delete(req, res)

      expect(userFindByIdAndRemoveStub.calledOnce).to.be.true
      expect(userFindByIdAndRemoveStub.calledWith(req.volunteer._id)).to.be.true
    })
  })
})