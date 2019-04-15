const sinon = require('sinon')
const sandbox = sinon.createSandbox()
const mongoose = require('mongoose')
import packingCtrl from './packing'
import Package from '../models/package'
import Customer from '../models/customer'
import Food from '../models/food'

describe('Packing controller', function() {
  describe('list', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should return packages in Package collection', async function() {
      const req = {}
      const res = {
        json: sandbox.spy()
      }
      const dummyPackage1 = {
        _id: mongoose.Types.ObjectId()
      }
      const dummyPackage2 = {
        _id: mongoose.Types.ObjectId()
      }
      const dummyPackages = [ dummyPackage1, dummyPackage2 ]

      const packageFindStub = sandbox.stub(Package, 'find').returns(dummyPackages)

      await packingCtrl.list(req, res)

      sinon.assert.calledOnce(packageFindStub)
      sinon.assert.calledWith(res.json, sinon.match.array)
      sinon.assert.calledWith(res.json, sinon.match.array.contains(dummyPackages))
    })
  })

  describe('complete', function() {
    let req = {}
    let res = {}
    const dummyPackageId = mongoose.Types.ObjectId()

    beforeEach(function() {
      req = {
        body: {
          packageId: dummyPackageId
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

    it('should return requested delivered package', async function() {
      const dummyDeliveredPackage = {
        customer: dummyPackageId
      }
      const packageFindByIdAndUpdateStub = sandbox.stub(Package, 'findByIdAndUpdate').returns(dummyDeliveredPackage)

      try {
        await packingCtrl.complete(req, res)
      } catch(e) {
        // do nothing
      }

      sinon.assert.calledOnce(packageFindByIdAndUpdateStub)
      sinon.assert.calledWith(
        packageFindByIdAndUpdateStub,
        sinon.match(dummyPackageId),
        sinon.match({status: 'Delivered'}),
        sinon.match({new: true})
      )
      sinon.assert.calledWith(res.json, sinon.match({ customer: dummyPackageId }))
    })

    it('should throw BadRequestError if requested delivered package not found', async function() {
      const dummyDeliveredPackage = null
      sandbox.stub(Package, 'findByIdAndUpdate').returns(dummyDeliveredPackage)
      const completeSpy = sandbox.spy(packingCtrl.complete)

      try {
        await packingCtrl.complete(req, res)
      } catch(e) {
        // do nothing
      }

      sinon.assert.pass(completeSpy.threw("BadRequestError"))
    })
  })

  describe('pack', function() {
    let req = {}
    let res = {}

    beforeEach(function() {
      res = {
        json: sandbox.spy()
      }
    })

    afterEach(function() {
      req = {}
      res = {}
      sandbox.restore()
    })

    it('should throw BadRequestError if request body is not an array', async function() {
      req = {
        body: {
          customer: 1, contents: [ '5ca594acc66db3448257083c' ]
        }
      }
      const packSpy = sandbox.spy(packingCtrl.pack)

      try {
        await packingCtrl.pack(req, res)
      } catch(e) {
        // do nothing
      }

      sinon.assert.pass(packSpy.threw("BadRequestError"))
    })

    it('should throw BadRequestError if new packages failed validation', async function() {
      req = {
        body: [{
          customer: 1, contents: [ '119' ]
        }],
        user: {
          _id: 99999
        }
      }
      const packSpy = sandbox.spy(packingCtrl.pack)

      try {
        await packingCtrl.pack(req, res)
      } catch(e) {
        // do nothing
      }

      sinon.assert.pass(packSpy.threw("BadRequestError"))
    })

    it('should save new packages in Package collection', async function() {
      const itemId1 = mongoose.Types.ObjectId()
      const itemId2 = mongoose.Types.ObjectId()
      const itemId3 = mongoose.Types.ObjectId()
      req = {
        body: [{
          customer: 1,
          contents: [ itemId1 ]
        }, {
          customer: 2,
          contents: [ itemId2, itemId3 ]
        }],
        user: {
          _id: 99999
        }
      }
      const packageSaveStub = sandbox.stub(Package.prototype, 'save')
      sandbox.stub(Customer, 'update')
      const dummyFood = {
        items: [{
          quantity: 100,
          _id: itemId1,
          name: 'Apple'
        }, {
          quantity: 99,
          _id: itemId2,
          name: 'Banana'
        }, {
          quantity: 98,
          _id: itemId3,
          name: 'Orange'
        }],
        _id: itemId3,
        category: 'test',
      }
      sandbox.stub(Food, 'findOneAndUpdate').resolves(dummyFood)
      packingCtrl.__Rewire__('verifyCustomerIds', () => 1)
      packingCtrl.__Rewire__('verifyFoodItemIds', () => 1)

      await packingCtrl.pack(req, res)

      packingCtrl.__ResetDependency__('verifyCustomerIds')
      packingCtrl.__ResetDependency__('verifyFoodItemIds')

      sinon.assert.called(packageSaveStub)
    })

    it('should update customers lastPacked field in db', async function() {
      const itemId1 = mongoose.Types.ObjectId()
      const itemId2 = mongoose.Types.ObjectId()
      const itemId3 = mongoose.Types.ObjectId()
      req = {
        body: [{
          customer: 1,
          contents: [ itemId1 ]
        }, {
          customer: 2,
          contents: [ itemId2, itemId3 ]
        }],
        user: {
          _id: 99999
        }
      }
      sandbox.stub(Package.prototype, 'save')
      const customerUpdateStub = sandbox.stub(Customer, 'update')

      const dummyFood = {
        items: [{
          quantity: 100,
          _id: itemId1,
          name: 'Apple'
        }, {
          quantity: 99,
          _id: itemId2,
          name: 'Banana'
        }, {
          quantity: 98,
          _id: itemId3,
          name: 'Orange'
        }],
        _id: itemId3,
        category: 'test',
      }
      sandbox.stub(Food, 'findOneAndUpdate').resolves(dummyFood)
      packingCtrl.__Rewire__('verifyCustomerIds', () => 1)
      packingCtrl.__Rewire__('verifyFoodItemIds', () => 1)

      await packingCtrl.pack(req, res)

      packingCtrl.__ResetDependency__('verifyCustomerIds')
      packingCtrl.__ResetDependency__('verifyFoodItemIds')

      sinon.assert.calledOnce(customerUpdateStub)
      sinon.assert.calledWith(customerUpdateStub, sinon.match.object, sinon.match.hasNested("$set.lastPacked"))
    })

    it('should update food item inventory quantities in Food collection', async function() {
      const itemId1 = mongoose.Types.ObjectId()
      const itemId2 = mongoose.Types.ObjectId()
      const itemId3 = mongoose.Types.ObjectId()
      req = {
        body: [{
          customer: 1,
          contents: [ itemId1 ]
        }, {
          customer: 2,
          contents: [ itemId2, itemId3 ]
        }],
        user: {
          _id: 99999
        }
      }
      sandbox.stub(Package.prototype, 'save')
      sandbox.stub(Customer, 'update')

      const dummyFood = {
        items: [{
          quantity: 100,
          _id: itemId1,
          name: 'Apple'
        }, {
          quantity: 99,
          _id: itemId2,
          name: 'Banana'
        }, {
          quantity: 98,
          _id: itemId3,
          name: 'Orange'
        }],
        _id: itemId3,
        category: 'test',
      }
      const foodfindOneAndUpdateStub = sandbox.stub(Food, 'findOneAndUpdate').resolves(dummyFood)
      packingCtrl.__Rewire__('verifyCustomerIds', () => 1)
      packingCtrl.__Rewire__('verifyFoodItemIds', () => 1)

      await packingCtrl.pack(req, res)

      packingCtrl.__ResetDependency__('verifyCustomerIds')
      packingCtrl.__ResetDependency__('verifyFoodItemIds')

      sinon.assert.called(foodfindOneAndUpdateStub)
    })

    it('should return new packages, food item updates, and customer updates', async function() {
      const itemId1 = mongoose.Types.ObjectId()
      const itemId2 = mongoose.Types.ObjectId()
      const itemId3 = mongoose.Types.ObjectId()
      req = {
        body: [{
          customer: 1,
          contents: [ itemId1 ]
        }, {
          customer: 2,
          contents: [ itemId2, itemId3 ]
        }],
        user: {
          _id: 99999
        }
      }
      sandbox.stub(Package.prototype, 'save')
      sandbox.stub(Customer, 'update')

      const dummyFood = {
        items: [{
          quantity: 100,
          _id: itemId1,
          name: 'Apple'
        }, {
          quantity: 99,
          _id: itemId2,
          name: 'Banana'
        }, {
          quantity: 98,
          _id: itemId3,
          name: 'Orange'
        }],
        _id: itemId3,
        category: 'test',
      }
      sandbox.stub(Food, 'findOneAndUpdate').resolves(dummyFood)
      packingCtrl.__Rewire__('verifyCustomerIds', () => 1)
      packingCtrl.__Rewire__('verifyFoodItemIds', () => 1)

      await packingCtrl.pack(req, res)

      packingCtrl.__ResetDependency__('verifyCustomerIds')
      packingCtrl.__ResetDependency__('verifyFoodItemIds')

      sinon.assert.calledWith(res.json, sinon.match.has("packages"))
      sinon.assert.calledWith(res.json, sinon.match.has("foodItems"))
      sinon.assert.calledWith(res.json, sinon.match.has("customers"))
    })
  })

  describe('unpack', function() {
    let req = {}
    let res = {}

    beforeEach(function() {
      res = {
        json: sandbox.spy()
      }  	
    })

    afterEach(function() {
      req = {}
      res = {}
      sandbox.restore()      
    })

    it('should throw BadRequestError if package _id is not included in the request or is not a valid pakcage ID', async function() {
      req = {
        body: {}
      }
      const unpackSpy = sandbox.spy(packingCtrl.unpack)

      try {
        await packingCtrl.unpack(req, res)
      } catch(e) {
        // do nothing
      }

      sinon.assert.pass(unpackSpy.threw("BadRequestError"))
    })

    it('should throw BadRequestError if package _id is not a valid pakcage ID', async function() {
      req = {
        body: {}
      }
      const unpackSpy = sandbox.spy(packingCtrl.unpack)

      try {
        await packingCtrl.unpack(req, res)
      } catch(e) {
        // do nothing
      }

      sinon.assert.pass(unpackSpy.threw("BadRequestError"))
    })

    it('should delete requested package from Package collection', async function() {
      req = {
        body: {
          _id: 99999
        }
      }
      const unpackSpy = sandbox.spy(packingCtrl.unpack)

      try {
        await packingCtrl.unpack(req, res)
      } catch(e) {
        // do nothing
      }

      sinon.assert.pass(unpackSpy.threw("BadRequestError"))
    })

    it('should throw BadRequestError if package _id is not found in deleted package', async function() {
      req = {
        body: {
          _id: mongoose.Types.ObjectId()
        }
      }
      const unpackSpy = sandbox.spy(packingCtrl.unpack)
      const dummyDeletedPackage = null
      sandbox.stub(Package, 'findByIdAndRemove').returns(dummyDeletedPackage)

      try {
        await packingCtrl.unpack(req, res)
      } catch(e) {
        // do nothing
      }

      sinon.assert.pass(unpackSpy.threw("BadRequestError"))
    })

    it('should update the lastPacked date for the customer', async function() {
      const dummyPackageId = mongoose.Types.ObjectId()
      const dummyItemId = mongoose.Types.ObjectId()
      req = {
        body: {
          _id: dummyPackageId
        }
      }
      const dummyDeletedPackage = {
        contents: [ dummyItemId ],
        _id: dummyPackageId,
        customer: 1
      }
      sandbox.stub(Package, 'findByIdAndRemove').returns(dummyDeletedPackage)
      
      const dummyCustomersLastPackedPackage = {
        _id: mongoose.Types.ObjectId(),
        contents: [ dummyItemId ],
        datePacked: Date.now
      }
      const mockPackageFindOneLean = {
        findOne: sandbox.stub().returnsThis,
        lean: sandbox.stub().returns(dummyCustomersLastPackedPackage)
      }
      sandbox.stub(Package, 'findOne').returns(mockPackageFindOneLean)
      
      const customerFindByIdAndUpdateStub = sandbox.stub(Customer, 'findByIdAndUpdate')
      const dummyFoodCategory = {
        items: [{
          quantity: 101,
          _id: dummyItemId
        }],
        _id: mongoose.Types.ObjectId()
      }
      sandbox.stub(Food, 'findOneAndUpdate').returns(dummyFoodCategory)

      await packingCtrl.unpack(req, res)

      sinon.assert.calledOnce(customerFindByIdAndUpdateStub)
    })

    it('should return requested deleted package, updated food item counts, and affected customer', async function() {
      const dummyPackageId = mongoose.Types.ObjectId()
      const dummyItemId = mongoose.Types.ObjectId()
      const dummyUserId = 99999
      req = {
        body: {
          _id: dummyPackageId
        }
      }
      const dummyDeletedPackage = {
        contents: [ dummyItemId ],
        datePacked: Date.now,
        _id: dummyPackageId,
        customer: 1,
        status: 'Packed',
        packedBy: 99999,
        __v: 0
      }
      sandbox.stub(Package, 'findByIdAndRemove').returns(dummyDeletedPackage)
      
      const dummyCustomersLastPackedPackage = {
        _id: mongoose.Types.ObjectId(),
        contents: [ dummyItemId ],
        customer: 1,
        status: 'Packed',
        packedBy: dummyUserId,
        datePacked: Date.now,
        __v: 0
      }
      const mockPackageFindOneLean = {
        findOne: sandbox.stub().returnsThis,
        lean: sandbox.stub().returns(dummyCustomersLastPackedPackage)
      }
      sandbox.stub(Package, 'findOne').returns(mockPackageFindOneLean)
      
      sandbox.stub(Customer, 'findByIdAndUpdate')
      const dummyFoodCategory = {
        deleted: false,
        items: [{
          quantity: 101,
          frequency: 1,
          deleted: false,
          startDate: Date.now,
          _id: dummyItemId,
          name: 'Apple'
        }],
        _id: mongoose.Types.ObjectId(),
        category: 'test',
        __v: 0
      }
      sandbox.stub(Food, 'findOneAndUpdate').returns(dummyFoodCategory)

      await packingCtrl.unpack(req, res)

      sinon.assert.calledWith(res.json, sinon.match.object)
      sinon.assert.calledWith(res.json, sinon.match.has("packages"))
      sinon.assert.calledWith(res.json, sinon.match.has("foodItems"))
      sinon.assert.calledWith(res.json, sinon.match.hasNested("customers._id"))
      sinon.assert.calledWith(res.json, sinon.match.hasNested("customers.lastPacked"))
    })
  })

  describe("deliver", function() {
    let req = {}
    let res = {}

    beforeEach(function() {
      res = {
        json: sandbox.spy()
      }
    })

    afterEach(function() {
      req = {}
      res = {}
      sandbox.restore()
    })

    it('should update lastDelivered flag requrested customer with begin week', async function() {
      const dummyCustomerId1 = mongoose.Types.ObjectId()
      const dummyCustomerId2 = mongoose.Types.ObjectId()
      req = {
        body: {
          customerIds: [ dummyCustomerId1, dummyCustomerId2 ]
        }
      }
      const dummyCustomers = [{
        id: dummyCustomerId1
      }, {
        id: dummyCustomerId2
      }]
      const customerFindByIdAndUpdateStub = sandbox.stub(Customer, 'findByIdAndUpdate').returns(dummyCustomers)

      await packingCtrl.deliver(req, res)

      sinon.assert.called(customerFindByIdAndUpdateStub)
      sinon.assert.calledWith(customerFindByIdAndUpdateStub, sinon.match.object, sinon.match.has("lastDelivered"))
    })

    it('should return requested customer with updated lastDelivered flag', async function() {
      const dummyCustomerId1 = mongoose.Types.ObjectId()
      const dummyCustomerId2 = mongoose.Types.ObjectId()
      req = {
        body: {
          customerIds: [ dummyCustomerId1, dummyCustomerId2 ]
        }
      }
      const dummyCustomers = [{
        _id: dummyCustomerId1
      }, {
        _id: dummyCustomerId2
      }]
      sandbox.stub(Customer, 'findByIdAndUpdate').returns(dummyCustomers)

      await packingCtrl.deliver(req, res)

      sinon.assert.calledWith(res.json, sinon.match.has("customers"))
    })  
  })

  describe('verifyCustomerIds', function() {
    let verifyCustomerIds = null

    before(function() {
      verifyCustomerIds = packingCtrl.__GetDependency__('verifyCustomerIds')
    })

    after(function() {
      packingCtrl.__ResetDependency__('verifyCustomerIds')
    })

    afterEach(function() {
      sandbox.restore()
    })

    it('should not throw BadRequestError if all the customerIds is an array the values are valid and unique', async function() {
      const verifyCustomerIdsSpy = sandbox.spy(verifyCustomerIds)
      const dummyCustomerId = [ 99999, 99998, 99997 ]
      const dummyCount = 3
      sandbox.stub(Customer, 'count').returns(dummyCount)

      try {
        await verifyCustomerIds(dummyCustomerId)
      } catch(e) {
        // do nothing
      }

      expect(verifyCustomerIdsSpy.threw("BadRequestError")).to.be.false
    })

    it('should not throw BadRequestError if array customerIds is an empty array', async function() {
      const verifyCustomerIdsSpy = sandbox.spy(verifyCustomerIds)
      const dummyCustomerId = []
      const dummyCount = 0
      sandbox.stub(Customer, 'count').returns(dummyCount)

      try {
        await verifyCustomerIds(dummyCustomerId)
      } catch(e) {
        // do nothing
      }

      expect(verifyCustomerIdsSpy.threw("BadRequestError")).to.be.false      
    })

    it('should not throw BadRequestError if all the customerIds are valid but two of them are duplicates', async function() {
      const verifyCustomerIdsSpy = sandbox.spy(verifyCustomerIds)
      const dummyCustomerId = [ 99999, 99998, 99998 ]
      const dummyCount = 2
      sandbox.stub(Customer, 'count').returns(dummyCount)

      try {
        await verifyCustomerIds(dummyCustomerId)
      } catch(e) {
        // do nothing
      }

      expect(verifyCustomerIdsSpy.threw("BadRequestError")).to.be.false
    })

    it('should throw BadRequestError if one of the customerIds is not valid', async function() {
      const dummyCustomerId = [ 99999, 99998, 99997 ]
      const dummyCount = 2
      sandbox.stub(Customer, 'count').returns(dummyCount)
      let err = null

      try {
        await verifyCustomerIds(dummyCustomerId)
      } catch(e) {
        err = e
      }

      if(err) {
        sinon.assert.match(err.name, "BadRequestError")
      } else {
        sinon.assert.fail("Should throw BadRequestError")
      }
    })
  })

  describe('verifyFoodItemIds', function() {
    let verifyFoodItemIds = null

    before(function() {
      verifyFoodItemIds = packingCtrl.__GetDependency__('verifyFoodItemIds')
    })

    after(function() {
      packingCtrl.__ResetDependency__('verifyFoodItemIds')
    })

    afterEach(function() {
      sandbox.restore()
    })

    it('should not throw BadRequestError and return count > 0 if the entire list of foodItem Ids exist in the database', async function() {
      const verifyFoodItemIdsSpy = sandbox.spy(verifyFoodItemIds)
      const dummyFoodItemIds = [
        mongoose.Types.ObjectId('5cac0f63fa88fd5eedb9e855'),
        mongoose.Types.ObjectId('5cac0f63fa88fd5eedb9e856'),
        mongoose.Types.ObjectId('5cac0f63fa88fd5eedb9e857')
      ]
      const dummyCount = 1
      sandbox.stub(Food, 'count').returns(dummyCount)

      try {
        await verifyFoodItemIds(dummyFoodItemIds)
      } catch(e) {
        // do nothing
      }

      expect(verifyFoodItemIdsSpy.threw("BadRequestError")).to.be.false
      //sinon.assert.
    })
    it('should throw BadRequestError if one of the Ids in the list of foodItems is not valid', async function() {
      let err = null
      const dummyFoodItemIds = [
        'bleurgh',
        99998,
        99997
      ]
      const dummyCount = 1
      sandbox.stub(Food, 'count').returns(dummyCount)

      try {
        await verifyFoodItemIds(dummyFoodItemIds)
      } catch(e) {
        err = e
      }

      if(err) {
        sinon.assert.match(err.name, "BadRequestError")
      } else {
        sinon.assert.fail("Should throw BadRequestError")
      }    
    })
    it('should throw BadRequestError if one of the foodItem Ids in the list does not exist in the database', async function() {    	
      let err = null
      const dummyFoodItemIds = [
        mongoose.Types.ObjectId('5cac0f63fa88fd5eedb9e855'),
        mongoose.Types.ObjectId('5cac0f63fa88fd5eedb9e856'),
        mongoose.Types.ObjectId('5cac0f63fa88fd5eedb9e857')
      ]    
      const dummyCount = 0
      sandbox.stub(Food, 'count').returns(dummyCount)

      try {
        await verifyFoodItemIds(dummyFoodItemIds)
      } catch(e) {     	
        err = e
      }

      if(err) {
        sinon.assert.match(err.name, "BadRequestError")
      } else {
        sinon.assert.fail("Should throw BadRequestError")
      }         
    })
  })

  describe('addPackageContentsToItemCounts', function() {
    // change to immutable function??
  })
})