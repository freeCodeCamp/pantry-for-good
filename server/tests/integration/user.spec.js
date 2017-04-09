import Customer from '../../models/customer'
import {createTestUser, initApp} from '../helpers'

let User, app

describe('User Api', function() {
  before(async function() {
    await initDb()
    app = initApp()
    User = require('../../models/user').default
    await Customer.find().remove()
    await User.find().remove()
  })

  afterEach(async function() {
    await Customer.find().remove()
    await User.find().remove()
  })

  after(async function() {
    await resetDb()
  })

  it('signs up', async function() {
    const newCustomer = createTestUser('user', 'customer')
    const request = supertest.agent(app())

    return await request.post('/api/auth/signup')
      .send(newCustomer)
      .expect(res => {
        expect(res.body).to.be.an.object
        expect(res.body).to.have.property('_id')
      })
  })

  it('signs in', async function() {
    const newCustomer = createTestUser('user', 'customer')
    const request = supertest.agent(app())

    await request.post('/api/auth/signup')
      .send(newCustomer)

    return await request.post('/api/auth/signin')
      .send(newCustomer)
      .expect(res => {
        expect(res.body).to.be.an.object
        expect(res.body).to.have.property('_id')
      })
  })
})
