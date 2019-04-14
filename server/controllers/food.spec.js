const sinon = require('sinon')
const sandbox = sinon.createSandbox()
const mongoose = require('mongoose')
import foodCtrl from './food'
import {ADMIN_ROLE, volunteerRoles} from '../../common/constants'
import Food from '../models/food'
import Customer from '../models/customer'
const {INVENTORY} = volunteerRoles

describe('Food controller', function() {
  const dummyUserId = 99999
  const dummyFoodId = mongoose.Types.ObjectId('5c9dc7e893382f0e9f0af664')

  describe('create', function() {
    let req = {}
    let res = {}
    let foodSaveStub = null
    let createSpy = null

    beforeEach(function() {
      req = {
        user: {
          firstName: 'admin',
          lastName: 'test',
          roles: [ ADMIN_ROLE ],
          //created: 2019-03-29T03:34:55.647Z,
          notifications: [],
          _id: dummyUserId,
          email: 'admin@test.com',
          provider: 'local',
          __v: 0
        },
        body: {
          category: 'test food',
          items: [ { name: 'test item' } ]
        }
      }
      res = {
        json: sandbox.spy()
      }

      const dummyFood = {
        _id: 99999
      }
      foodSaveStub = sandbox.stub(Food.prototype, 'save').returns(dummyFood)
      createSpy = sandbox.spy(foodCtrl.create)
    })

    afterEach(function() {
      req = {}
      res = {}
      foodSaveStub = null
      sandbox.restore()
    })

    it('should throw ValidationError if requested food category already exists', async function() {
      const dummyExistingFoodCategory = [ 'test food' ]
      const mockFindLean = {
        find: sandbox.stub().returnsThis,
        lean: sandbox.stub().returns(dummyExistingFoodCategory)
      }

      sandbox.stub(Food, 'find').returns(mockFindLean)

      try {
        await foodCtrl.create(req, res)
      } catch(e) {
        // do nothing
      }
      
      sinon.assert.pass(createSpy.threw("ValidationError"))
      sinon.assert.notCalled(foodSaveStub)
      sinon.assert.notCalled(res.json)
    })

    it('should save food cateogry if requested food category does not exist yet', async function() {
      const dummyExistingFoodCategory = []
      const mockFindLean = {
        find: sandbox.stub().returnsThis,
        lean: sandbox.stub().returns(dummyExistingFoodCategory)
      }

      sandbox.stub(Food, 'find').returns(mockFindLean)

      try {
        await foodCtrl.create(req, res)
      } catch(e) {
        // do nothing
      }

      expect(createSpy.threw("ValidationError")).to.be.false
      sinon.assert.calledOnce(foodSaveStub)
    })

    it('should return saved food category if requested food cateogry does not exist yet', async function() {
      const dummyExistingFoodCategory = []
      const mockFindLean = {
        find: sandbox.stub().returnsThis,
        lean: sandbox.stub().returns(dummyExistingFoodCategory)
      }

      sandbox.stub(Food, 'find').returns(mockFindLean)

      try {
        await foodCtrl.create(req, res)
      } catch(e) {
        // do nothing     
      }

      expect(createSpy.threw("ValidationError")).to.be.false
      sinon.assert.calledWith(res.json, sinon.match({ _id: dummyUserId }))
    })
  })

  describe('update', function() {
    let req = {}
    let res = {}
    const currTs = Date.now
    let foodSaveStub = null

    beforeEach(function() {
      req = {
        user: {
          firstName: 'admin',
          lastName: 'test',
          roles: [ ADMIN_ROLE ],
          created: currTs,
          notifications: [],
          _id: dummyUserId,
          email: 'admin@test.com',
          provider: 'local',
          __v: 0
        },
        food: {
          deleted: false,
          items: [],
          _id: dummyFoodId,
          category: 'test food',
          __v: 0
        },
        body: {
          category: 'new category'
        }
      }
      res = {
        json: sandbox.spy()
      }

      const dummyFood = {
        deleted: false,
        items: [],
        _id: dummyFoodId,
        category: 'new category',
        __v: 0
      }
      foodSaveStub = sandbox.stub(Food.prototype, 'save').returns(dummyFood)
    })

    afterEach(function() {
      foodSaveStub = null
      sandbox.restore()
    })

    it('should update the requested food', async function() {
      await foodCtrl.update(req, res)

      sinon.assert.calledOnce(foodSaveStub)
    })

    it('should return the updated food', async function() {
      await foodCtrl.update(req, res)

      sinon.assert.calledWith(res.json, sinon.match({ _id: dummyFoodId }))
    })
  })

  describe('delete', function() {
    let req = {}
    let res = {}
    const currTs = Date.now
    let deleteSpy = null
    let foodFindByIdAndUpdateStub = null
    let foodRemoveStub = null

    beforeEach(function() {
      req = {
        user: {
          firstName: 'admin',
          lastName: 'test',
          roles: [ ADMIN_ROLE ],
          created: currTs,
          notifications: [],
          _id: 34590,
          email: 'admin@test.com',
          provider: 'local',
          __v: 0
        },
        food: {
          deleted: false,
          items: [],
          _id: dummyFoodId,
          category: 'test food',
          __v: 0
        }
      }
      res = {
        json: sandbox.spy()
      }

      deleteSpy = sandbox.spy(foodCtrl.delete)
      foodFindByIdAndUpdateStub = sandbox.stub(Food, 'findByIdAndUpdate')
      foodRemoveStub = sandbox.stub(Food, 'remove')
    })

    afterEach(function() {
      req = {}
      res = {}
      deleteSpy = null
      foodFindByIdAndUpdateStub = null
      foodRemoveStub = null
      sandbox.restore()
    })

    it('should throw BadRequestError if food category contains food items with property deleted = false', async function() {
      req.food.items.push({ deleted: false })

      try {
        await foodCtrl.delete(req, res)
      } catch(e) {
        // do nothing
      }

      sinon.assert.pass(deleteSpy.threw("BadRequestError"))
      sinon.assert.notCalled(foodFindByIdAndUpdateStub)
      sinon.assert.notCalled(foodRemoveStub)
    })

    it('should mark food item as deleted instead of being removed from db if the food category has items', async function() {
      req.food.items.push({ deleted: true })

      try {
        await foodCtrl.delete(req, res)
      } catch(e) {
        // do nothing
      }

      expect(deleteSpy.threw("BadRequestError")).to.be.false
      sinon.assert.calledOnce(foodFindByIdAndUpdateStub)
      sinon.assert.notCalled(foodRemoveStub)
    })

    it('should return deleted food item', async function() {
      req.food.items.push({ deleted: true })

      try {
        await foodCtrl.delete(req, res)
      } catch(e) {
        // do nothing
      }

      expect(deleteSpy.threw("BadRequestError")).to.be.false
      sinon.assert.calledWith(res.json, sinon.match({ _id: dummyFoodId }))
    })
  })

  describe('list', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should return food category list', async function() {
      const dummyFoods = [{
        _id: dummyFoodId,
      }]
      const mockFindSort = {
        find: sandbox.stub().returnsThis,
        sort: sandbox.stub().returns(dummyFoods)
      }
      const foodFindStub = sandbox.stub(Food, 'find').returns(mockFindSort)

      const req = {}
      const res = {
        json: sandbox.spy()
      }

      await foodCtrl.list(req, res)

      sinon.assert.calledOnce(foodFindStub)
      sinon.assert.calledWith(res.json, sinon.match.array.deepEquals(dummyFoods))      
    })
  })

  describe('createItem', function() {
    let req = {}
    let res = {}

    beforeEach(function() {
      req = {
        user: {
          roles: [ ADMIN_ROLE ],
          _id: dummyUserId
        },
        body: {
          name: 'test item'
        },
        food: {
          _id: dummyFoodId
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

    it('should check to see if an item with the same name already exists in a category', async function() {    	
      const dummyItemId = mongoose.Types.ObjectId('5ca06f857e69770f7a8e4345')
      const dummyFoodCategoryId = mongoose.Types.ObjectId('5ca06f857e69770f7a8e4344')
      const dummyFoodCategoryWithExistingItem = {
        _id: mongoose.Types.ObjectId(),
        items: [{
          categoryId: dummyFoodId,
          quantity: 99
        }]
      }
      const mockFindOneLean = {
        findOne: sandbox.stub().returnsThis,
        lean: sandbox.stub().returns(dummyFoodCategoryWithExistingItem)
      }
      const dummyUpdatedFoodCategory = {
        items: [ {
          _id: dummyItemId,
          name: 'test item'
        } ],
        _id: dummyFoodCategoryId
      }

      const foodFindOneStub = sandbox.stub(Food, 'findOne').returns(mockFindOneLean)
      foodCtrl.__Rewire__('updateItemHelper', () => dummyUpdatedFoodCategory)

      await foodCtrl.createItem(req, res)

      foodCtrl.__ResetDependency__('updateItemHelper')

      sinon.assert.calledOnce(foodFindOneStub)
      sinon.assert.calledWith(res.json, sinon.match({ _id: dummyFoodCategoryId }))    
    })  

    it('should return updated food category if requested food category has existing item', async function() {   	
      const dummyFoodCategoryWithExistingItem = null
      const mockFindOneLean = {
        findOne: sandbox.stub().returnsThis,
        lean: sandbox.stub().returns(dummyFoodCategoryWithExistingItem)
      }
      const dummySavedFood = {
        _id: mongoose.Types.ObjectId(dummyFoodId)
      }

      const foodFindOneStub = sandbox.stub(Food, 'findOne').returns(mockFindOneLean)
      const foodFindByIdAndUpdateStub = sandbox.stub(Food, 'findByIdAndUpdate').returns(dummySavedFood)

      await foodCtrl.createItem(req, res)

      sinon.assert.calledOnce(foodFindOneStub)
      sinon.assert.calledOnce(foodFindByIdAndUpdateStub)
      sinon.assert.calledWith(res.json, sinon.match({ _id: dummyFoodId }))      
    })   
  })
 
  describe('updateItem', function() {
    let req = {}
    let res = {}
    const dummyItemId = mongoose.Types.ObjectId()

    beforeEach(function() {
      req = {
        user: {
          roles: [ ADMIN_ROLE ],
          _id: dummyUserId
        },
        params: {
          foodId: dummyFoodId,
          itemId: dummyItemId
        },
        body: {
          _id: dummyItemId,
          name: 'updated item'
        }
      }
      res = {
        json: sandbox.spy()
      }
    })

    afterEach(function() {
      sandbox.restore()
    })

    it('should return updated food category', async function() {
      const dummyUpdatedFoodCategory = {
        _id: dummyFoodId
      }
      foodCtrl.__Rewire__('updateItemHelper', () => dummyUpdatedFoodCategory)

      await foodCtrl.updateItem(req, res)

      foodCtrl.__ResetDependency__('updateItemHelper')

      sinon.assert.calledWith(res.json, sinon.match({ _id: dummyFoodId }))
    })
  })

  describe('deleteItem', function() {
    let req = {}
    let res = {}
    const dummyItemId = mongoose.Types.ObjectId()

    beforeEach(function() {
      req = {
        user: {
          firstName: 'admin',
          lastName: 'test',
          roles: [ ADMIN_ROLE ],
          created: Date.now,
          notifications: [],
          _id: dummyUserId,
          email: 'admin@test.com',
          provider: 'local',
          __v: 0
        },
        food: {
          deleted: false,
          items: [ {
            quantity: 0,
            frequency: 1,
            deleted: Date.now,
            _id: dummyItemId,
            name: 'test item'
          } ],
          _id: dummyFoodId,
          category: 'test category',
          __v: 0
        },
        itemId: dummyItemId
      }
      res = {
        json: sandbox.spy()
      }
    })

    afterEach(function() {
      sandbox.restore()
    })

    it('should delete requested food item', async function() {
      const foodUpdateStub = sandbox.stub(Food, 'update')
      sandbox.stub(Customer, 'update')

      await foodCtrl.deleteItem(req, res)

      sinon.assert.calledOnce(foodUpdateStub)
      sinon.assert.calledWith(
        foodUpdateStub,
        sinon.match({
          _id: dummyFoodId,
          "items._id": dummyItemId 
        }),
        sinon.match({
          $set: {"items.$.deleted": true}
        })
      )
    })

    it('should update customer food preferences', async function() {
      sandbox.stub(Food, 'update')
      const customerUpdateStub = sandbox.stub(Customer, 'update')

      await foodCtrl.deleteItem(req, res)

      sinon.assert.calledOnce(customerUpdateStub)
      sinon.assert.calledWith(
        customerUpdateStub,
        sinon.match({}),
        sinon.match({ $pull: { "foodPreferences": dummyItemId } }),
        sinon.match({multi: true})
      )
    })

    it('should return requested deleted food item ID', async function() {
      sandbox.stub(Food, 'update')
      sandbox.stub(Customer, 'update')

      await foodCtrl.deleteItem(req, res)

      sinon.assert.calledWith(res.json, sinon.match({ deletedItemId: dummyItemId }))
    })
  })

  describe('authorizeByRole', function() {
    let authorizeByRoleSpy = null
    let authorizeByRole = null

    beforeEach(function() {
      authorizeByRole = foodCtrl.__GetDependency__('authorizeByRole')
      authorizeByRoleSpy = sandbox.spy(authorizeByRole)
    })

    afterEach(function() {
      foodCtrl.__ResetDependency__('authorizeByRole')
      authorizeByRoleSpy = null
      authorizeByRole = null
      sandbox.restore()
    })

    it('should throw ForbiddenError if requested user role is not one of the roles allowed to be authenticated', function() {
      const userRoles = [ "roles/dummy" ]   

      try {
        authorizeByRole(userRoles, [INVENTORY])
      } catch(e) {
        // do nothing
      }

      sinon.assert.pass(authorizeByRoleSpy.threw("ForbiddenError"))
    })

    it('should not throw ForbibbenError if requested user role is admin role', function() {
      const userRoles = [ ADMIN_ROLE ]

      try {
        authorizeByRole(userRoles, [INVENTORY])
      } catch(e) {
        // do nothing
      }

      expect(authorizeByRoleSpy.threw("ForbiddenError")).to.be.false
    })

    it('should not throw ForbibbenError if requested user role is not admin role but is one of the roles allowed to be authenticated', function() {
      const userRoles = [ INVENTORY ]

      try {
        authorizeByRole(userRoles, [INVENTORY])
      } catch(e) {
        // do nothing
      }

      expect(authorizeByRoleSpy.threw("ForbiddenError")).to.be.false      
    })
  })

  describe('updateItemHelper', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should call updateFoodItemWithCategoryChange if updatedItem categoryId matches with original category ID', function() {
      const originalCategoryId = dummyFoodId
      //const dummyItemId = mongoose.Types.ObjectId()
      const dummyItemId = dummyFoodId
      const updatedItem = {
        categoryId: dummyItemId
      }

      const expectedFuncCall = "updateFoodItemWithoutCategoryChange"

      const updateItemHelper = foodCtrl.__GetDependency__('updateItemHelper')
      foodCtrl.__Rewire__('updateFoodItemWithoutCategoryChange', () => "updateFoodItemWithoutCategoryChange")
      foodCtrl.__Rewire__('updateFoodItemWithCategoryChange', () => "updateFoodItemWithCategoryChange")


      const actualFuncCalled = updateItemHelper(originalCategoryId, updatedItem)

      sinon.assert.match(actualFuncCalled, expectedFuncCall)

      foodCtrl.__ResetDependency__('updateItemHelper')
      foodCtrl.__ResetDependency__('updateFoodItemWithoutCategoryChange')
      foodCtrl.__ResetDependency__('updateFoodItemWithCategoryChange')
    })

    it('should call updateFoodItemWithoutCategoryChange if updatedItem does not have categoryId', function() {
      const originalCategoryId = dummyFoodId
      const updatedItem = {}
      const expectedFuncCall = "updateFoodItemWithoutCategoryChange"

      const updateItemHelper = foodCtrl.__GetDependency__('updateItemHelper')
      foodCtrl.__Rewire__('updateFoodItemWithoutCategoryChange', () => "updateFoodItemWithoutCategoryChange")
      foodCtrl.__Rewire__('updateFoodItemWithCategoryChange', () => "updateFoodItemWithCategoryChange")

      const actualFuncCalled = updateItemHelper(originalCategoryId, updatedItem)

      sinon.assert.match(actualFuncCalled, expectedFuncCall)

      foodCtrl.__ResetDependency__('updateItemHelper')
      foodCtrl.__ResetDependency__('updateFoodItemWithoutCategoryChange')
      foodCtrl.__ResetDependency__('updateFoodItemWithCategoryChange')
    })

    it('should call updateFoodItemWithoutCategoryChange if updatedItem categoryId does not match with original category ID', function() {
      const originalCategoryId = dummyFoodId
      const dummyItemId = mongoose.Types.ObjectId()
      const updatedItem = {
        categoryId: dummyItemId
      }

      const expectedFuncCall = "updateFoodItemWithCategoryChange"

      const updateItemHelper = foodCtrl.__GetDependency__('updateItemHelper')
      foodCtrl.__Rewire__('updateFoodItemWithoutCategoryChange', () => "updateFoodItemWithoutCategoryChange")
      foodCtrl.__Rewire__('updateFoodItemWithCategoryChange', () => "updateFoodItemWithCategoryChange")

      const actualFuncCalled = updateItemHelper(originalCategoryId, updatedItem)

      sinon.assert.match(actualFuncCalled, expectedFuncCall)

      foodCtrl.__ResetDependency__('updateItemHelper')
      foodCtrl.__ResetDependency__('updateFoodItemWithoutCategoryChange')
      foodCtrl.__ResetDependency__('updateFoodItemWithCategoryChange')
    })
  })
})