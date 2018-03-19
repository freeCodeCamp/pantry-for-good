import {find} from 'lodash'

import {createUserSession, createTestUser} from '../helpers'
import {ADMIN_ROLE, questionnaireIdentifiers} from '../../../common/constants'
import Customer from '../../models/customer'
import Food, {FoodItem} from '../../models/food'
import Package from '../../models/package'
import User from '../../models/user'
import Questionnaire from '../../models/questionnaire'

describe('Packing Api', function() {
  before(async function() {
    await initDb()
    await Customer.find().remove()
    await User.find().remove()
    await Food.find().remove()
    await Package.find().remove()
    await Questionnaire.find().remove()
    await Questionnaire.create({
      name: 'Customer Application',
      identifier: questionnaireIdentifiers.CUSTOMER
    })
  })

  afterEach(async function() {
    await Customer.find().remove()
    await User.find().remove()
    await Food.find().remove()
    await Package.find().remove()
  })

  after(async function() {
    await Questionnaire.find().remove()
    await resetDb()
  })

  describe('packing GET route', function() {
    it ('Returns empty array when no packages', async function() {

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      return request.get('/api/packing')
        .expect(200)
        .expect(function (res) {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.length(0)
        })
    })

    it('Returns one item when there is 1 packed item', async function () {
      const foodItems = [
        new FoodItem({ name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1 }),
        new FoodItem({ name: 'Banana', quantity: 100, startDate: '2017-06-25', frequency: 1 }),
      ]
      const food = await Food.create({ category: 'test', items: foodItems })

      const foodItemIds = food.items.map(item => item._id.toString())

      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      const package1 = await Package.create({
        customer: customer._id,
        status: 'Packed',
        packedBy: 0,
        contents: foodItemIds
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      const expected = [{
        __v: package1.__v,
        _id: package1._id.toString(),
        customer: package1.customer,
        datePacked: package1.datePacked.toISOString(),
        packedBy: package1.packedBy,
        status: package1.status,
        contents: package1.contents.map(_id => _id.toString())
      }]

      return request.get('/api/packing')
        .expect(200)
        .expect(function (res) {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.length(1)
          expect(res.body).to.eql(expected)
        })
    })

    it('Returns 2 packages when there are 2 packages', async function () {

      const foodItems = [
        new FoodItem({ name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1 }),
        new FoodItem({ name: 'Banana', quantity: 100, startDate: '2017-06-25', frequency: 1 }),
      ]
      const food = await Food.create({ category: 'test', items: foodItems })

      const foodItemIds = food.items.map(item => item._id.toString())

      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      const package1 = await Package.create({
        customer: customer._id,
        status: 'Packed',
        packedBy: 0,
        contents: foodItemIds[0]
      })

      const package2 = await Package.create({
        customer: customer._id,
        status: 'Packed',
        packedBy: 0,
        contents: foodItemIds[1]
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      const expected = [package1, package2].map(p => ({
        __v: p.__v,
        _id: p._id.toString(),
        customer: p.customer,
        datePacked: p.datePacked.toISOString(),
        packedBy: p.packedBy,
        status: p.status,
        contents: p.contents.map(_id => _id.toString())
      }))

      return request.get('/api/packing')
        .expect(200)
        .expect(function (res) {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.length(2)
          expect(res.body).to.eql(expected)
        })
    })
  })

  describe('packing POST route', function() {

    it('Packs a package for one customer', async function() {
      let foodItems = [
        new FoodItem({name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1}),
        new FoodItem({name: 'Banana', quantity: 100, startDate: '2017-06-25', frequency: 1}),
        new FoodItem({name: 'Cantaloupe', quantity: 100, startDate: '2017-06-25', frequency: 1})
      ]
      const food = await Food.create({category: 'test', items: foodItems})

      const foodItemIds = food.items.map(item => item._id.toString())

      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      return request.post('/api/packing').send([{
        customer: customer._id,
        contents: foodItemIds
      }])
        .expect(200)
        .expect(function(res) {
          expect(res.body.packages).to.be.an('array')
          expect(res.body.packages).to.have.length(1)
          expect(res.body.packages[0]).to.have.property('customer', 1)
          expect(res.body.packages[0].contents).to.be.an('array')
          expect(res.body.packages[0].contents).to.have.length(3)
          expect(res.body.packages[0].contents).to.have.same.members(foodItemIds)
        })
    })

    it('Packs a package for two customers', async function() {
      let foodItems = [
        new FoodItem({name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1}),
        new FoodItem({name: 'Banana', quantity: 100, startDate: '2017-06-25', frequency: 1}),
        new FoodItem({name: 'Cantaloupe', quantity: 100, startDate: '2017-06-25', frequency: 1})
      ]
      const food = await Food.create({category: 'test', items: foodItems})

      const foodItemIds = food.items.map(item => item._id.toString())

      const customer1 = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      const customer2 = await Customer.create({
        _id: 2,
        firstName: 'Thomas',
        lastName: 'Jefferson',
        email: 'tj@example.com',
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      const package1Contents = [foodItemIds[0]]
      const package2Contents = [foodItemIds[1], foodItemIds[2]]
      return request.post('/api/packing').send([
        { "customer": customer1._id, "contents": package1Contents },
        { "customer": customer2._id, "contents": package2Contents }
      ])
        .expect(200)
        .expect(function(res) {
          expect(res.body.packages).to.be.an('array')
          expect(res.body.packages).to.have.length(2)

          const package1 = find(res.body.packages, {customer: 1})
          expect(package1, 'No package found for customer1').to.exist
          expect(package1).to.have.property('customer', 1)
          expect(package1.contents).to.be.an('array')
          expect(package1.contents).to.have.length(1)
          expect(package1.contents).to.have.same.members(package1Contents)

          const package2 = find(res.body.packages, {customer: 2})
          expect(package2, 'No package found for customer2').to.exist
          expect(package2).to.have.property('customer', 2)
          expect(package2.contents).to.be.an('array')
          expect(package2.contents).to.have.length(2)
          expect(package2.contents).to.have.same.members(package2Contents)
        })
    })

    it('Updates the customers lastPacked date', async function() {
      let foodItems = [
        new FoodItem({name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1}),
      ]
      const food = await Food.create({category: 'test', items: foodItems}).then(food => food.toObject())

      const foodItemIds = food.items.map(item => item._id.toString())

      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
        status: 'Accepted',
        lastPacked: '2017-01-01',
        foodPreferences: foodItemIds,
      }).then(customer => customer.toObject())

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      const reply = await request.post('/api/packing').send(
        [{customer: customer._id, contents: customer.foodPreferences }]
      )

      return request.get(`/api/customer/${customer._id}`)
        .expect(200)
        .expect(function(res) {
          expect(res.body.lastPacked).to.equal(reply.body.packages[0].datePacked)
        })
    })

    it('Updates the food inventory', async function() {
      let foodItems = [
        new FoodItem({name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1}),
        new FoodItem({name: 'Banana', quantity: 100, startDate: '2017-06-25', frequency: 1}),
        new FoodItem({name: 'Cantaloupe', quantity: 100, startDate: '2017-06-25', frequency: 1})
      ]
      const food = await Food.create({category: 'test', items: foodItems})

      const foodItemIds = food.items.map(item => item._id.toString())

      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      return request.post('/api/packing').send([{
        customer: customer._id,
        contents: [foodItemIds[0], foodItemIds[1]]
      }])
        .expect(200)
        .then(function () {
          return Food.find({}).lean()
        })
        .then(function (food) {
          const foodItemsFromDb = food[0].items
          const updatedItems = foodItemIds.map(_id =>
            foodItemsFromDb.find(item => item._id.equals(_id))
          )
          expect(updatedItems[0].quantity).to.equal(99)
          expect(updatedItems[1].quantity).to.equal(99)
          expect(updatedItems[2].quantity).to.equal(100)
        })
    })

    it('Returns 400 if customer property is not set', async function() {
      let foodItems = [
        new FoodItem({name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1}),
      ]
      const food = await Food.create({category: 'test', items: foodItems})

      const foodItemIds = food.items.map(item => item._id.toString())

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      return request.post('/api/packing').send([{
        contents: foodItemIds
      }])
        .expect(400)
        .expect(function (res) {
          expect(res.body.message).to.equal('Package validation failed: customer: Path `customer` is required.')
        })
    })

    it('Returns 400 if an invalid customerId is given', async function() {
      let foodItems = [
        new FoodItem({name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1}),
      ]
      const food = await Food.create({category: 'test', items: foodItems})

      const foodItemIds = food.items.map(item => item._id.toString())

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      return request.post('/api/packing').send([{
        customer: 9999, contents: foodItemIds
      }])
        .expect(400)
        .expect(function (res) {
          expect(res.body.message).to.equal('One or more customerIds are not valid')
        })
    })

    it('Returns 400 if contents are not set', async function () {
      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
        status: 'Accepted',
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      return request.post('/api/packing').send(
        [{ customer: customer._id}]
      )
        .expect(400)
        .expect(function (res) {
          expect(res.body.message).to.equal('Package validation failed: contents: Path `contents` is required to have at least one element.')
        })
    })

    it('Returns 400 if contents is not an array', async function () {
      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      return request.post('/api/packing').send(
        [{ customer: customer._id, contents: '123456789'}]
      )
        .expect(400)
        .expect(function (res) {
          expect(res.body.message).to.equal('Package validation failed: contents: Cast to Array failed for value "123456789" at path "contents"')
        })
    })

    it('Returns 400 if an invalid foodItem is specified', async function () {
      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      return request.post('/api/packing').send(
        [{ customer: customer._id, contents: ['xxxxxxxxxxxxxxxxxxxxxxxx']}]
      )
        .expect(400)
        .expect(function (res) {
          expect(res.body.message).to.equal('Package validation failed: contents: Cast to Array failed for value "[ \'xxxxxxxxxxxxxxxxxxxxxxxx\' ]" at path "contents"')
        })
    })

    it('Returns 400 if a foodItem is not found in the database', async function () {
      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      const nonExistingFoodItemId = '594d6a4f9431ac26453cef07'
      return request.post('/api/packing').send(
        [{ customer: customer._id, contents: [nonExistingFoodItemId]}]
      )
        .expect(400)
        .expect(function (res) {
          expect(res.body.message).to.equal(`foodItem ${nonExistingFoodItemId} was not found in the database`)
        })
    })
  })

  describe('packing DELETE route', function() {

    it('Unpacks a package', async function() {
      const foodItems = [
        new FoodItem({name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1}),
      ]
      const food = await Food.create({category: 'test', items: foodItems})
      const foodItemIds = food.items.map(item => item._id.toString())

      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)

      const testPackage = await Package.create({
        customer: customer._id,
        contents: foodItemIds,
        status: 'Packed',
        packedBy: session.user._id
      })

      const request = supertest.agent(session.app)

      return request.delete('/api/packing').send({ _id: testPackage._id, })
        .expect(200)
        .then(function() {
          return Package.find({})
        })
        .then(function(packages){
          expect(packages).to.have.length(0)
        })
    })

    it('Does not unpack other packages', async function () {
      const foodItems = [
        new FoodItem({ name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1 }),
      ]
      const food = await Food.create({ category: 'test', items: foodItems })
      const foodItemIds = food.items.map(item => item._id.toString())

      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com'
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)

      const testPackage1 = await Package.create({
        customer: customer._id,
        contents: foodItemIds,
        status: 'Packed',
        packedBy: session.user._id
      })

      const testPackage2 = await Package.create({
        customer: customer._id,
        contents: foodItemIds,
        status: 'Packed',
        packedBy: session.user._id
      })

      const request = supertest.agent(session.app)

      return request.delete('/api/packing').send({
        _id: testPackage2._id,
      })
        .expect(200)
        .then(function () {
          return (Package.find({}))
        })
        .then(function (results) {
          expect(results).to.be.an('array')
          expect(results).to.have.length(1)
          expect(results[0]._id.equals(testPackage1._id)).to.be.true
        })
    })

    it('Adds the foodItems from the package back to the inventory counts', async function() {
      const foodItems = [
        new FoodItem({name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1}),
      ]
      const food = await Food.create({category: 'test', items: foodItems})
      const foodItemIds = food.items.map(item => item._id.toString())

      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)

      const testPackage = await Package.create({
        customer: customer._id,
        contents: foodItemIds,
        status: 'Packed',
        packedBy: session.user._id
      })

      const request = supertest.agent(session.app)

      return request.delete('/api/packing').send({ _id: testPackage._id, })
        .expect(200)
        .then(function() {
          return Food.find({})
        })
        .then(function(foods){
          expect(foods[0].items[0].quantity).to.equal(101)
        })
    })

    it('Updates the lastPacked date for the customer', async function() {
      const foodItems = [
        new FoodItem({name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1}),
      ]
      const food = await Food.create({category: 'test', items: foodItems})
      const foodItemIds = food.items.map(item => item._id.toString())

      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)

      const testPackage = await Package.create({
        customer: customer._id,
        contents: foodItemIds,
        status: 'Packed',
        packedBy: session.user._id
      })

      const request = supertest.agent(session.app)

      return request.delete('/api/packing').send({ _id: testPackage._id, })
        .expect(200)
        .then(function() {
          return Customer.findById(1)
        })
        .then(function(customer){
          expect(customer.lastPacked).to.be.a('null')
        })
    })

    it('Returns 400 when a package _id is not specified', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      return request.delete('/api/packing')
        .expect(400)
        .expect(function (res) {
          expect(res.body.message).to.equal(`package _id must be included in the request`)
        })
    })

    it('Returns 400 when a package _id is not valid', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      return request.delete('/api/packing').send({ _id: 'xxxxxxxx', })
        .expect(400)
        .expect(function (res) {
          expect(res.body.message).to.equal('xxxxxxxx is not a valid package _id')
        })
    })

    it('Returns 400 when a package _id is not found in the database', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      return request.delete('/api/packing').send({ _id: '594d6a4f9431ac26453cef08', })
        .expect(400)
        .expect(function (res) {
          expect(res.body.message).to.equal('package with _id 594d6a4f9431ac26453cef08 not found')
        })
    })

  })

})
