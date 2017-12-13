import {
  ADMIN_ROLE,
  clientRoles,
  volunteerRoles,
  questionnaireIdentifiers
} from '../../../common/constants'
import Customer from '../../models/customer'
import Volunteer from '../../models/volunteer'
import {createGuestSession, createUserSession, createTestUser} from '../helpers'
import User from '../../models/user'
import Questionnaire from '../../models/questionnaire'
import Food, {FoodItem} from '../../models/food'
import Package from '../../models/package'

describe('Customer Api', function() {
  before(async function() {
    await initDb()
    await Customer.find().remove()
    await Volunteer.find().remove()
    await User.find().remove()
    await Package.find().remove()
    await Questionnaire.find().remove()
    await new Questionnaire({
      name: 'Customer Application',
      identifier: questionnaireIdentifiers.CUSTOMER
    }).save()
    await new Questionnaire({
      name: 'Volunteer Application',
      identifier: questionnaireIdentifiers.VOLUNTEER
    }).save()
  })

  afterEach(async function() {
    await Customer.find().remove()
    await User.find().remove()
    await Package.find().remove()
    await Volunteer.find().remove()
  })

  after(async function() {
    await Questionnaire.find().remove()
    await resetDb()
  })

  describe('POST /api/customer', function() {
    it('requires login', async function() {
      const app = createGuestSession()
      const request = supertest.agent(app)

      return request.post('/api/customer').expect(401)
    })

    it('creates customers', async function() {
      const newCustomer = createTestUser('user', clientRoles.CUSTOMER)
      const {user, app} = await createUserSession(newCustomer)
      const request = supertest.agent(app)

      return request.post('/api/customer')
        .send(user)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status', 'Pending')
        })
        .expect(200)
    })


    it('doesn\'t create duplicate customers', async function() {
      const newCustomer = createTestUser('user', clientRoles.CUSTOMER)
      const {user, app} = await createUserSession(newCustomer)
      const request = supertest.agent(app)

      await request.post('/api/customer')
        .send(user)

      return request.post('/api/customer')
        .send(user)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message', 'Unique field already exists')
        })
        .expect(400)
    })
  })

  describe('User routes', function() {
    it('shows a customer', async function() {
      const newCustomer = createTestUser('user', clientRoles.CUSTOMER)
      const {user, app} = await createUserSession(newCustomer)
      const request = supertest.agent(app)

      await request.post('/api/customer')
        .send(user)

      return request.get(`/api/customer/${user._id}`)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('firstName', 'user')
        })
        .expect(200)
    })

    it('doesn\'t show non-existing customer', async function() {
      const newCustomer = createTestUser('user', clientRoles.CUSTOMER)
      const {user, app} = await createUserSession(newCustomer)
      const request = supertest.agent(app)

      return request.get(`/api/customer/${user._id}`)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message', 'Not found')
        })
        .expect(404)
    })

    it('doesn\'t show other customers', async function() {
      const firstCustomer = createTestUser('user1', clientRoles.CUSTOMER)
      const secondCustomer = createTestUser('user2', clientRoles.CUSTOMER)

      const first = await createUserSession(firstCustomer)
      const second = await createUserSession(secondCustomer)

      const firstReq = supertest.agent(first.app)
      const secondReq = supertest.agent(second.app)

      await secondReq.post('/api/customer')
        .send(second.user)

      return firstReq.get(`/api/customer/${second.user._id}`)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message', 'User is not authorized')
        })
        .expect(403)
    })

    it('updates customers', async function() {
      const newCustomer = createTestUser('user', clientRoles.CUSTOMER)
      const {user, app} = await createUserSession(newCustomer)
      const request = supertest.agent(app)

      const savedCustomer = (await request.post('/api/customer')
        .send(user)).body

      const updatedCustomer = {
        ...savedCustomer,
        firstName: 'updated'
      }

      return request.put(`/api/customer/${user._id}`)
        .send(updatedCustomer)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('firstName', 'updated')
        })
        .expect(200)
    })
  })

  describe('Admin routes', function() {
    it('lists customers', async function() {
      const newAdmin = createTestUser('admin', ADMIN_ROLE)
      const newCustomer = createTestUser('user', clientRoles.CUSTOMER)
      const admin = await createUserSession(newAdmin)
      const customer = await createUserSession(newCustomer)

      const adminReq = supertest.agent(admin.app)
      const customerReq = supertest.agent(customer.app)

      await customerReq.post('/api/customer')
        .send(customer.user)

      return adminReq.get(`/api/customer`)
        .expect(res => {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.lengthOf(1)
          expect(res.body[0]).to.have.property('firstName', 'user')
        })
        .expect(200)
    })

    it('rejects non-admins', async function() {
      const newCustomer = createTestUser('user', clientRoles.CUSTOMER)
      const customer = await createUserSession(newCustomer)

      const customerReq = supertest.agent(customer.app)

      return customerReq.get(`/api/customer`)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message', 'User is not authorized')
        })
        .expect(403)
    })

    it('deletes customers', async function() {
      const newAdmin = createTestUser('admin', ADMIN_ROLE)
      const newCustomer = createTestUser('user', clientRoles.CUSTOMER)
      const admin = await createUserSession(newAdmin)
      const customer = await createUserSession(newCustomer)

      const adminReq = supertest.agent(admin.app)
      const customerReq = supertest.agent(customer.app)

      await customerReq.post('/api/customer')
        .send(newCustomer)

      return adminReq.delete(`/api/admin/customers/${customer.user._id}`)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('firstName', 'user')
        })
        .expect(200)
    })

    it('Won\'t delete a customer that has packages', async function () {
      const foodItems = [new FoodItem({ name: 'Apple', quantity: 100, startDate: '2017-06-25', frequency: 1 })]
      const food = await Food.create({ category: 'test', items: foodItems })

      const customer = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      await Package.create({
        customer: customer._id,
        status: 'Packed',
        packedBy: 0,
        contents: food.items.map(item => item._id.toString())
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      // delete the customer associated with the package
      return request.delete(`/api/admin/customers/${customer._id}`)
        .expect(409)
        .expect(function(res) {
          expect(res.body).to.have.property('message', 'This customer has packages and can\'t be deleted')
        })
    })

    it('assigns customers', async function() {
      const newAdmin = createTestUser('admin', ADMIN_ROLE)
      const newCustomer = createTestUser('customer', clientRoles.CUSTOMER)
      const newVolunteer = createTestUser('driver', null, {roles: [
        clientRoles.VOLUNTEER, volunteerRoles.DRIVER]})

      const admin = await createUserSession(newAdmin)
      const customer = await createUserSession(newCustomer)
      const volunteer = await createUserSession(newVolunteer)

      const adminReq = supertest.agent(admin.app)
      const customerReq = supertest.agent(customer.app)
      const volunteerReq = supertest.agent(volunteer.app)

      const savedCustomer = (await customerReq.post('/api/customer')
        .send(newCustomer)).body

      const savedVolunteer = (await volunteerReq.post('/api/volunteer')
        .send(newVolunteer)).body

      return adminReq.post('/api/admin/delivery/assign')
        .send({
          customerIds: [savedCustomer._id],
          driverId: savedVolunteer._id
        })
        .expect(200)
        .expect(res => {
          expect(res.body.customers).to.be.an('array')
          expect(res.body.customers).to.have.length(1)
          expect(res.body.customers[0]).to.have.property('assignedTo', savedVolunteer._id)
        })
    })

    it('When deleting a customer, it deletes its occurance in Volunteers.customers', async function() {
      const customer1 = await Customer.create({
        _id: 1,
        firstName: 'George',
        lastName: 'Washington',
        email: 'gw@example.com',
      })

      const customer2 = await Customer.create({
        _id: 2,
        firstName: 'Ben',
        lastName: 'Franklin',
        email: 'bf@example.com',
      })

      const volunteer = await Volunteer.create({
        _id: 3,
        customers: [customer1._id, customer2._id]
      })

      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(testAdmin)
      const request = supertest.agent(session.app)

      await request.delete(`/api/admin/customers/${customer1._id}`).expect(200)

      const updatedVolunteer = await Volunteer.findById(volunteer._id).lean()
      expect(updatedVolunteer.customers).to.eql([customer2._id])

    })

  })
})
