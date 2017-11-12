import {ADMIN_ROLE, clientRoles} from '../../../common/constants'
import Food, {FoodItem} from '../../models/food'
import {createUserSession, createTestUser} from '../helpers'
import User from '../../models/user'

describe('Food Api', function() {
  before(async function() {
    await initDb()
    await Food.find().remove()
    await User.find().remove()
  })

  afterEach(async function() {
    await Food.find().remove()
    await User.find().remove()
  })

  after(async function() {
    await resetDb()
  })

  describe('User routes', function() {
    it('lists food categories', async function() {
      const testUser = createTestUser('user', clientRoles.CUSTOMER)
      const testAdmin = createTestUser('admin', ADMIN_ROLE)

      const user = await createUserSession(testUser)
      const admin = await createUserSession(testAdmin)

      const userRequest = supertest.agent(user.app)
      const adminRequest = supertest.agent(admin.app)

      const testFood = {
        category: 'test food',
        items: [
          {name: 'test item'}
        ]
      }

      await adminRequest.post('/api/foods')
        .send(testFood)

      return userRequest.get('/api/foods')
        .expect(res => {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.length(1)
          expect(res.body[0]).to.have.property('items')
          expect(res.body[0].items[0]).to.have.property('name', 'test item')
        })
    })
  })

  describe('Admin routes', function () {
    it('creates food categories', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const {app} = await createUserSession(testAdmin)
      const request = supertest.agent(app)

      const testFood = {category: 'test food'}

      return request.post('/api/foods')
        .send(testFood)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('category', 'test food')
        })
        .expect(200)
    })

    it('lists food categories', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const {app} = await createUserSession(testAdmin)
      const request = supertest.agent(app)

      const testFood = {category: 'test food'}

      await request.post('/api/foods')
        .send(testFood)

      return request.get('/api/foods')
        .expect(res => {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.length(1)
          expect(res.body[0]).to.have.property('category', 'test food')
        })
        .expect(200)
    })

    it('updates a food categories', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const {app} = await createUserSession(testAdmin)
      const request = supertest.agent(app)

      const testFood = {category: 'test food'}

      const savedFood = (await request.post('/api/foods')
        .send(testFood)).body

      const updatedFood = {category: 'new category'}

      return request.put(`/api/foods/${savedFood._id}`)
        .send(updatedFood)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('category', 'new category')
        })
        .expect(200)
    })

    it('deletes a food categories', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const {app} = await createUserSession(testAdmin)
      const request = supertest.agent(app)

      const testFood = {category: 'test food'}

      const savedFood = (await request.post('/api/foods')
        .send(testFood)).body

      return request.delete(`/api/foods/${savedFood._id}`)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('category', 'test food')
        })
        .expect(200)
    })

    it('adds food items', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const {app} = await createUserSession(testAdmin)
      const request = supertest.agent(app)

      const testCategory = {category: 'test food'}
      const testItem = {name: 'test item'}

      const savedCategory = (await request.post('/api/foods')
        .send(testCategory)).body

      return request.post(`/api/foods/${savedCategory._id}/items`)
        .send(testItem)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('items')
          expect(res.body.items).to.be.an('array')
          expect(res.body.items).to.have.length(1)
          expect(res.body.items[0]).to.have.property('name', 'test item')
        })
        .expect(200)
    })

    it('updates food items', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const {app} = await createUserSession(testAdmin)
      const request = supertest.agent(app)

      const testCategory = {category: 'test category'}
      const testItem = {name: 'test item'}

      const savedCategory = (await request.post('/api/foods')
        .send(testCategory)).body

      const savedCategoryWithItem = (await request
        .post(`/api/foods/${savedCategory._id}/items`)
        .send(testItem)
      ).body

      const updatedItem = {
        ...savedCategoryWithItem.items[0],
        name: 'updated item'
      }

      const itemId = savedCategoryWithItem.items[0]._id
      return request.put(`/api/foods/${savedCategory._id}/items/${itemId}`)
        .send(updatedItem)
        .expect(res => {
          expect(res.body).to.have.property('items')
          expect(res.body.items[0]).to.have.property('name', 'updated item')
        })
        .expect(200)
    })

    it('changes food items category', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const {app} = await createUserSession(testAdmin)
      const request = supertest.agent(app)

      const testCategory1 = {category: 'test category 1'}
      const testCategory2 = {category: 'test category 2'}
      const testItem = {name: 'test item'}

      const savedCategory1 = (await request.post('/api/foods')
        .send(testCategory1)).body

      const savedCategory2 = (await request.post('/api/foods')
        .send(testCategory2)).body

      const savedCategoryWithItem = (await request
        .post(`/api/foods/${savedCategory1._id}/items`)
        .send(testItem)
      ).body

      const savedItem = savedCategoryWithItem.items[0]

      const updatedItem = {
        ...savedItem,
        name: 'test item',
        categoryId: savedCategory2._id
      }

      return request.put(`/api/foods/${savedCategory1._id}/items/${savedItem._id}`)
        .send(updatedItem)
        .expect(res => {
          expect(res.body).to.have.property('_id', savedCategory2._id)
          expect(res.body.items[0]).to.have.property('name', 'test item')
        })
        .expect(200)
    })

    it('deletes food items', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const {app} = await createUserSession(testAdmin)
      const request = supertest.agent(app)

      const testCategory = {category: 'test category'}
      const testItem = {name: 'test item'}

      const savedCategory = (await request.post('/api/foods')
        .send(testCategory)).body

      const savedCategoryWithItem = (await request
        .post(`/api/foods/${savedCategory._id}/items`)
        .send(testItem)
      ).body

      const itemId = savedCategoryWithItem.items[0]._id

      await request.delete(`/api/foods/${savedCategory._id}/items/${itemId}`)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.property('deletedItemId')
          expect(res.body.deletedItemId).to.equal(itemId)
        })

      // Fetch the foods to make sure it is not still there
      return request.get('/api/foods')
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length(1)
          expect(res.body[0].items.filter(item => !item.deleted)).to.have.length(0)
        })
    })

    it('creates a new item when a deleted item with the same name exists', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const {app} = await createUserSession(testAdmin)
      const request = supertest.agent(app)

      const apple = await FoodItem.create({name: 'apple', quantity: 2, deleted: true})
      const category = await Food.create({category: 'fruits', items: [apple]})

      return request.post(`/api/foods/${category._id}/items`)
        .send({ name: 'apple', quantity: 10 })
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('items')
          expect(res.body.items).to.be.an('array')
          expect(res.body.items).to.have.length(2)
          const item = res.body.items.find(i => i.name === 'apple' && i.deleted === false && i.quantity === 10)
          expect(item).to.not.be.undefined
        })
    })

    it('creates a new item when  deleted item with the same name exists and another item is not deleted', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const {app} = await createUserSession(testAdmin)
      const request = supertest.agent(app)

      const apple = await FoodItem.create({name: 'apple', quantity: 2, deleted: true})
      const banana = await FoodItem.create({name: 'banana', quantity: 5, deleted: false})
      const category = await Food.create({category: 'fruits', items: [apple, banana]})

      return request.post(`/api/foods/${category._id}/items`)
        .send({ name: 'apple', quantity: 10 })
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('items')
          expect(res.body.items).to.be.an('array')
          expect(res.body.items).to.have.length(3)
          const item = res.body.items.find(i => i.name === 'apple' && i.deleted === false && i.quantity === 10)
          expect(item).to.not.be.undefined
        })
    })

  })
})
