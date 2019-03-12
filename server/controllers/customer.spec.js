/*
const sinon = require('sinon')
const sandbox = sinon.createSandbox()
import {omit} from 'lodash'
import customerCtrl from './customer'
import Customer from '../models/customer'
import User from '../models/user'
import { customerStatus } from './../../common/constants'
import Volunteer from '../models/volunteer'
import Package from '../models/package'
import mailer from '../lib/mail/mail-helpers'


describe('Customer controller', function() {
  describe('create', function() {
    let req = {}
    let res = {}

    beforeEach(function() {
      req = {
        body: {
          firstName: 'user',
          lastName: 'test',
          email: 'user@test.com',
          __v: 0
        },
        user: {
          id: 99999
        }
      }

      res = {
        json: sandbox.spy(),
        status: sandbox.stub().returnsThis
      }
    })

    afterEach(function() {
      req = {}
      res = {}
      sandbox.restore()
    })    

    it('should return created customer object', async function() {      
      const expectedResult = {    
        fields: [],
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        _id: req.user.id
      }

      const customerSaveStub = sandbox.stub(Customer.prototype, 'save').returns(expectedResult)
      const userFindStub = sandbox.stub(User, 'findOneAndUpdate')
	
      await customerCtrl.create(req, res)
     
      sinon.assert.calledOnce(userFindStub)
      sinon.assert.calledWith(userFindStub, sinon.match({ _id: req.user.id }))
      sinon.assert.calledOnce(customerSaveStub)
      sinon.assert.calledWith(res.json, sinon.match({ _id: req.user.id }))
      sinon.assert.calledWith(res.json, sinon.match({ firstName: req.body.firstName }))
      sinon.assert.calledWith(res.json, sinon.match({ lastName: req.body.lastName }))
    })
  })

  describe('read', function() {
    let req = {}
    let res = {}

    beforeEach(function() {
      req = {
        customer: {
          _id: 1,
          email: 'gw@example'
        }
      }

      res = {
        json: sandbox.spy(),
        status: sandbox.stub().returns({ end: sandbox.spy() })
      }
    })

    afterEach(function() {
      req = {}
      res = {}
    })

    it('should return customer object', function() {
      customerCtrl.read(req, res)
      sinon.assert.calledWith(res.json, sinon.match({ _id: req.customer._id }))
      sinon.assert.calledWith(res.json, sinon.match({ email: req.customer.email }))
    })
  })

  describe('update', function() {
    let req = {}
    let res = {}

    beforeEach(function() {
      const user = {
        firstName: 'user',
        lastName: 'test',
        password: 'L4MEacHJ1FgJBYKhd+C+0palG2LpfAIsQp6V+YQGwRFyY0E8qW344A+lBcU738ywAHPZwsLXla0UziAhVxQeyg==',
        roles: [ 'roles/customer' ],
        email: 'user@test.com',
        provider: 'local',
        notifications: [],
        _id: 99999,
        __v: 0
      }

      req = {
        body: {
          _id: user._id,
        },
        user,
        customer: new Customer(omit(req.body, ['status']))
      }      

      res = {
        json: sandbox.spy(),
        status: sandbox.stub().returns({ end: sandbox.spy() })
      }    
    })

    afterEach(function() {
      req = {}
      res = {}
      sandbox.restore()
    })

    it('should return updated customer object', async function() {
      const status = customerStatus.PENDING
      req.body.status = status
      req.customer.status = status

      const oldCustomer = {
        status: req.customer.status
      }
      const newCustomer = {
        _id: req.customer._id,
        email: req.customer.email,
        status: req.customer.status
      }      
      sandbox.stub(Customer, 'findById').returns(oldCustomer)
      const customerSaveStub = sandbox.stub(Customer.prototype, 'save').returns(newCustomer)
      mailer.__Rewire__('sendStatus', () => {})
      mailer.__Rewire__('sendUpdate', () => {})

      await customerCtrl.update(req, res)

      sinon.assert.calledOnce(customerSaveStub)
      sinon.assert.calledWith(res.json, sinon.match({ _id: newCustomer._id }))
      sinon.assert.calledWith(res.json, sinon.match({ email: newCustomer.email }))
    })
  })

  describe('list (get all)', function() {
    let mockFindAll = null
    let req = {}
    let res = {}

    beforeEach(function() {
      res = {
        json: sandbox.spy(),
        status: sandbox.stub().returns({ end: sandbox.spy() })
      }

      const dummy_customers = [{
        status: customerStatus.PENDING,       
        _id: 45633,
        firstName: 'user',
        lastName: 'test',
        email: 'user@test.com'
      }]

      mockFindAll = {
        sort: sandbox.stub().returnsThis,
        populate: sandbox.stub().returnsThis,
        exec: sinon.stub().returns(dummy_customers)
      }
    })

    afterEach(function() {
      sandbox.restore()
      mockFindAll = {}
    })

    it('should return array of customers', async () => {
      const customerStub = sandbox.stub(Customer, 'find').returns(mockFindAll)

      await customerCtrl.list(req, res)
      sinon.assert.calledOnce(customerStub)
      sinon.assert.calledWith(res.json, sinon.match.array)
    })
  })

  describe('get', function() {
    let req = {}
    let res = {}
    let next = null
    let id = null

    beforeEach(function() {
      req = {
        customer: null
      }
      next = () => {}
      id = 99999
    })

    afterEach(function() {
      req = {}
      res = {}
      next = null
      id = null

      sandbox.restore()
    })

    it('should return customer object if customer find success', async function() {
      const dummy_customer = {
        _id: req.id       
      }
      const customerFindStub = sandbox.stub(Customer, 'findById').resolves(dummy_customer)

      await customerCtrl.customerById(req, res, next, id)

      sinon.assert.calledOnce(customerFindStub)
      sinon.assert.calledWith(customerFindStub, id)
    })
  })

  describe('delete', function() {
    let req = {}
    let res = {}

    beforeEach(function() {
      const user = {
        firstName: 'user',
        lastName: 'test',
        email: 'user@test.com',
        _id: 99999
      } 

      req = {
        params: {},
        body: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email       
        },
        user,
        customer: new Customer(omit(req.body, ['status']))        
      }

      res = {
        json: sandbox.spy(),
        status: sandbox.stub().returns({ json: sandbox.spy() })
      }
    })

    afterEach(function() {
      req = {}
      res = {}
      sandbox.restore()
    })

    it('should update the volunteer if the customer is associated with any packages', async function() {
      const packageCount = 0
      const mockFindCount = {
        count: function() {
          return packageCount
        }
      }
      
      sandbox.stub(Package, 'find').returns(mockFindCount)     
      const volunteerUpdateStub = sandbox.stub(Volunteer, 'update').resolves('ok')
      sandbox.stub(Customer, 'findByIdAndRemove').resolves('ok')

      await customerCtrl.delete(req, res)

      sinon.assert.calledOnce(volunteerUpdateStub)
      sinon.assert.calledWith(res.json, sinon.match({ _id: req.customer._id }))
    })

    it('should return the deleted customer if the customer is associated with any packages', async function() {
      const packageCount = 0
      const mockFindCount = {
        count: function() {
          return packageCount
        }
      }
      
      sandbox.stub(Package, 'find').returns(mockFindCount)     
      sandbox.stub(Volunteer, 'update').resolves('ok')
      const customerDeleteStub = sandbox.stub(Customer, 'findByIdAndRemove').resolves('ok')

      await customerCtrl.delete(req, res)

      sinon.assert.calledOnce(customerDeleteStub)
      sinon.assert.calledWith(customerDeleteStub, req.customer._id)
      sinon.assert.calledWith(res.json, sinon.match({ _id: req.customer._id }))
    })

    it('should return status code 409 and error message if the customer is not associated with any packages', async function() {
      const packageCount =  1
      const expectedStatusCode = 409

      const mockFindCount = {
        count: function() {
          return packageCount
        }
      }
      sandbox.stub(Package, 'find').returns(mockFindCount)
      const customerDeleteStub = sandbox.stub(Customer, 'findByIdAndRemove').resolves('ok')

      await customerCtrl.delete(req, res)

      sinon.assert.notCalled(customerDeleteStub)
      sinon.assert.calledWith(res.status, expectedStatusCode)
      sinon.assert.calledWith(res.status(expectedStatusCode).json, sinon.match({ message: "This customer has packages and can't be deleted" }))
    })
  })
})
*/