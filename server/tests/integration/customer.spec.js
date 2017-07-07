import {
  ADMIN_ROLE,
  clientRoles,
  volunteerRoles,
  questionnaireIdentifiers
} from '../../../common/constants'
import Customer from '../../models/customer'
import {createUserSession, createTestUser} from '../helpers'
import User from '../../models/user'
import Questionnaire from '../../models/questionnaire'

describe('Customer Api', function() {
  before(async function() {
    await initDb()
    await Customer.find().remove()
    await User.find().remove()
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
  })

  after(async function() {
    await Questionnaire.find().remove()
    await resetDb()
  })

  describe('User routes', function() {
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
  })
})
