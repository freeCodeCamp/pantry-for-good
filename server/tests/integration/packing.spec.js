import {find} from 'lodash'
import moment from 'moment'

import {createUserSession, createTestUser} from '../helpers'

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
    await Questionnaire.create({ "name" : "Customer Application", "identifier" : "qCustomers", })  
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

  it('Packs a package for one customer', async function() {
    let foodItems = [
      new FoodItem({name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1}),
      new FoodItem({name: 'Banana', quantity: 100, startDate: '2017-06-25', frequency: 1}),
      new FoodItem({name: 'Cantaloupe', quantity: 100, startDate: '2017-06-25', frequency: 1})
    ]
    const food = await Food.create({category: 'test', items: foodItems}).then(food => food.toObject())

    // transform the foodItems from mongoose models to JSON objects used in the PUT request
    foodItems = foodItems.map(item => {
      let newItem = item.toObject()
      //The post requests shows the new item quantities after packing
      newItem.quantity = newItem.quantity - 1
      newItem.categoryId = food._id
      return newItem
    })

    const foodItemIds = food.items.map(item => item._id.toString())

    const customer = await Customer.create({
      _id: 1,
      firstName: 'George',
      lastName: 'Washington',
      email: 'gw@example.com',
      status: 'Accepted',
      foodPreferences: foodItemIds,
    }).then(customer => customer.toObject())
    customer.packingList = foodItems
    customer.id = 1

    const testAdmin = createTestUser('admin', 'admin', {roles: ['admin']})
    const session = await createUserSession(testAdmin)
    const request = supertest.agent(session.app)

    return request.post('/api/packing').send([{
      "customer": customer._id,
      "contents": foodItemIds
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
    const food = await Food.create({category: 'test', items: foodItems}).then(food => food.toObject())

    // transform the foodItems from mongoose models to JSON objects used in the PUT request
    foodItems = foodItems.map(item => {
      let newItem = item.toObject()
      //The post requests shows the new item quantities after packing
      newItem.quantity = newItem.quantity - 1
      newItem.categoryId = food._id
      return newItem
    })

    const foodItemIds = food.items.map(item => item._id.toString())

    const customer1 = await Customer.create({
      _id: 1,
      firstName: 'George',
      lastName: 'Washington',
      email: 'gw@example.com',
      status: 'Accepted',
      foodPreferences: [foodItemIds[0]],
    }).then(customer => customer.toObject())
    customer1.packingList = [foodItems[0]]
    customer1.id = 1

    const customer2 = await Customer.create({
      _id: 2,
      firstName: 'Thomas',
      lastName: 'Jefferson',
      email: 'tj@example.com',
      status: 'Accepted',
      foodPreferences: [foodItemIds[1], foodItemIds[2]],
    }).then(customer => customer.toObject())
    customer2.packingList = [foodItems[1], foodItems[2]]
    customer2.id = 2

    const testAdmin = createTestUser('admin', 'admin', {roles: ['admin']})
    const session = await createUserSession(testAdmin)
    const request = supertest.agent(session.app)

    return request.post('/api/packing').send([
      { "customer": customer1._id, "contents": customer1.foodPreferences },
      { "customer": customer2._id, "contents": customer2.foodPreferences }    
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
        const expectedContents1 = [foodItemIds[0]]
        expect(package1.contents).to.have.same.members(expectedContents1)

        const package2 = find(res.body.packages, {customer: 2})
        expect(package2, 'No package found for customer2').to.exist
        expect(package2).to.have.property('customer', 2)
        expect(package2.contents).to.be.an('array')
        expect(package2.contents).to.have.length(2)
        const expectedContents2 = [foodItemIds[1], foodItemIds[2]]
        expect(package2.contents).to.have.same.members(expectedContents2)
      })
  })

  it('Updates the customers lastPacked date', async function() {
    let foodItems = [
      new FoodItem({name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1}),
    ]
    const food = await Food.create({category: 'test', items: foodItems}).then(food => food.toObject())

    // transform the foodItems from mongoose models to JSON objects used in the PUT request
    foodItems = foodItems.map(item => {
      let newItem = item.toObject()
      //The post requests shows the new item quantities after packing
      newItem.quantity = newItem.quantity - 1
      newItem.categoryId = food._id
      return newItem
    })

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
    customer.packingList = foodItems
    customer.id = 1

    const testAdmin = createTestUser('admin', 'admin', {roles: ['admin']})
    const session = await createUserSession(testAdmin)
    const request = supertest.agent(session.app)

    await request.post('/api/packing').send([
      { "customer": customer._id, "contents": customer.foodPreferences },
    ])

    return request.get(`/api/customer/${customer._id}`)
      .expect(200)
      .expect(function(res) {
        const beginWeek = moment.utc().startOf('isoWeek')
        expect(res.body.lastPacked).to.equal(beginWeek.toISOString())
      })
  })  

})


