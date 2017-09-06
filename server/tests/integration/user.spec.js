import Customer from '../../models/customer'
import Volunteer from '../../models/volunteer'
import Donor from '../../models/donor'
import app from '../../config/express'
import User from '../../models/user'

describe('User Api', function() {
  before(async function() {
    await initDb()
  })

  beforeEach(async function() {
    await Customer.find().remove()
    await Volunteer.find().remove()
    await Donor.find().remove()
    await User.find().remove()
  })

  after(async function() {
    await Customer.find().remove()
    await Volunteer.find().remove()
    await Donor.find().remove()
    await User.find().remove()
    await resetDb()
  })

  describe('signup', function() {
    it('signs up users', async function() {
      const request = supertest.agent(app())
      const newUser = {
        firstName: 'Frank',
        lastName: 'Harper',
        email: 'fharper@example.com',
        password: '12345678'
      }
      return await request.post('/api/auth/signup')
        .send(newUser)
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('_id')
          expect(res.body.firstName).to.equal('Frank')
          expect(res.body.lastName).to.equal('Harper')
          expect(res.body.email).to.equal('fharper@example.com')
        })
    })

    it('it requires a first name', async function() {
      const request = supertest.agent(app())
      const newUser = {
        lastName: 'Willis',
        email: 'mwillis@example.com',
        password: '12345678'
      }
      return await request.post('/api/auth/signup')
        .send(newUser)
        .expect(400)
        .expect(res => {
          expect(res.body.paths.firstName).to.equal('Please fill in your first name')
        })
    })

    it('it requires a last name', async function() {
      const request = supertest.agent(app())
      const newUser = {
        firstName: 'Willis',
        email: 'mwillis@example.com',
        password: '12345678'
      }
      return await request.post('/api/auth/signup')
        .send(newUser)
        .expect(400)
        .expect(res => {
          expect(res.body.paths.lastName).to.equal('Please fill in your last name')
        })
    })

    it('requires a password', async function() {
      const request = supertest.agent(app())
      const newUser = {
        firstName: 'Margaret',
        lastName: 'Willis',
        email: 'mwillis@example.com'
      }
      return await request.post('/api/auth/signup')
        .send(newUser)
        .expect(400)
        .expect(res => {
          expect(res.body.paths.password).to.equal('Password should be longer')
        })
    })

    it('requires a password to be at least 6 characters', async function() {
      const request = supertest.agent(app())
      const newUser = {
        firstName: 'Margaret',
        lastName: 'Willis',
        email: 'mwillis@example.com',
        password: '12345'
      }
      return await request.post('/api/auth/signup')
        .send(newUser)
        .expect(400)
        .expect(res => {
          expect(res.body.paths.password).to.equal('Password should be longer')
        })
    })

    it('does not allow signup if email address already has an account', async function() {
      const request = supertest.agent(app())
      const newUser = {
        firstName: 'Frank',
        lastName: 'Harper',
        email: 'fharper@example.com',
        password: '12345678'
      }

      await request.post('/api/auth/signup')
        .send(newUser)

      const newUser2 = {
        firstName: 'Francine',
        lastName: 'Harper',
        email: 'fharper@example.com',
        password: '12345678'
      }
      return await request.post('/api/auth/signup')
        .send(newUser2)
        .expect(400)
        .expect(res => {
          expect(res.body.paths.email).to.equal('Email address already has an account')
        })
    })
  })

  describe('logging in', function() {
    it('signs in', async function() {
      const newUser = {
        firstName: 'Frank',
        lastName: 'Harper',
        email: 'fharper@example.com',
        password: '12345678'
      }
      const request = supertest.agent(app())
      await request.post('/api/auth/signup')
        .send(newUser)

      return await request.post('/api/auth/signin')
        .send({email: 'fharper@example.com', password: '12345678'})
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('_id')
        })
    })

    it('fails without an email', async function() {
      const newUser = {
        firstName: 'Frank',
        lastName: 'Harper',
        email: 'fharper@example.com',
        password: '12345678'
      }
      const request = supertest.agent(app())
      await request.post('/api/auth/signup')
        .send(newUser)

      return await request.post('/api/auth/signin')
        .send({password: '12345678'})
        .expect(400)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.message).to.equal('Missing credentials')
        })
    })

    it('fails without a password', async function() {
      const newUser = {
        firstName: 'Frank',
        lastName: 'Harper',
        email: 'fharper@example.com',
        password: '12345678'
      }
      const request = supertest.agent(app())
      await request.post('/api/auth/signup')
        .send(newUser)

      return await request.post('/api/auth/signin')
        .send({email: 'fharper@example.com'})
        .expect(400)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.message).to.equal('Missing credentials')
        })
    })

    it('fails with the wrong password', async function() {
      const newUser = {
        firstName: 'Frank',
        lastName: 'Harper',
        email: 'fharper@example.com',
        password: '12345678'
      }
      const request = supertest.agent(app())
      await request.post('/api/auth/signup')
        .send(newUser)

      return await request.post('/api/auth/signin')
        .send({email: 'fharper@example.com', password: 'xxxxxxxxx'})
        .expect(400)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.message).to.equal('Unknown user or invalid password')
        })
    })
  })

  describe('listing user accounts', function () {
    it('returns an empty array when there are no accounts', async function () {
      const request = supertest.agent(app())
      return await request.get('/api/users')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.length(0)
        })
    })

    it('returns one account when there is one account', async function () {
      await User.create({
        firstName: 'Frank',
        lastName: 'Harper',
        email: 'fharper@example.com',
        password: '12345678',
        provider: 'local'
      })

      const request = supertest.agent(app())
      return await request.get('/api/users')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.length(1)
          expect(res.body[0].firstName).to.equal('Frank')
          expect(res.body[0].lastName).to.equal('Harper')
          expect(res.body[0].email).to.equal('fharper@example.com')
        })
    })

    it('returns two account when there is two accounts', async function () {
      await User.create({
        firstName: 'Frank',
        lastName: 'Harper',
        email: 'fharper@example.com',
        password: '12345678',
        provider: 'local'
      })
      await User.create({
        firstName: 'Bill',
        lastName: 'Willis',
        email: 'mwillis@example.com',
        password: '12345678',
        provider: 'local'
      })

      const request = supertest.agent(app())
      return await request.get('/api/users')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.length(2)
          const frank = res.body.find(user => user.firstName === 'Frank')
          expect(frank.firstName).to.equal('Frank')
          expect(frank.lastName).to.equal('Harper')
          expect(frank.email).to.equal('fharper@example.com')
          const bill = res.body.find(user => user.firstName === 'Bill')
          expect(bill.firstName).to.equal('Bill')
          expect(bill.lastName).to.equal('Willis')
          expect(bill.email).to.equal('mwillis@example.com')
        })
    })
  })

  describe('getting a user by userId', function () {
    it('Gets the user', async function () {
      const user = await User.create({
        firstName: 'Frank',
        lastName: 'Harper',
        email: 'fharper@example.com',
        password: '12345678',
        provider: 'local'
      })
      await User.create({
        firstName: 'Bill',
        lastName: 'Willis',
        email: 'mwillis@example.com',
        password: '12345678',
        provider: 'local'
      })

      const request = supertest.agent(app())
      return await request.get(`/api/users/${user._id}`)
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.firstName).to.equal('Frank')
          expect(res.body.lastName).to.equal('Harper')
          expect(res.body.email).to.equal('fharper@example.com')
        })
    })

    it('returns when the user does not exist', async function () {
      const user = await User.create({
        firstName: 'Frank',
        lastName: 'Harper',
        email: 'fharper@example.com',
        password: '12345678',
        provider: 'local'
      })
      await User.create({
        firstName: 'Bill',
        lastName: 'Willis',
        email: 'mwillis@example.com',
        password: '12345678',
        provider: 'local'
      })

      await User.remove({_id: user._id})

      const request = supertest.agent(app())
      return await request.get(`/api/users/${user._id}`)
        .expect(400)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.message).to.equal(`UserId ${user._id} not found`)
        })
    })

  })

})
