import Customer from '../../models/customer'
import Volunteer from '../../models/volunteer'
import Donor from '../../models/donor'
import app from '../../config/express'
import User from '../../models/user'
import { ADMIN_ROLE } from '../../../common/constants'
import { createUserSession, createTestUser } from '../helpers'

import {searchUserAndSetNotification} from '../../lib/notification-sender'

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

    it('requires a password to be at least 7 characters long', async function() {
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
    let request
    beforeEach(async function() {
      const user = createTestUser('admin', ADMIN_ROLE)
      const session = await createUserSession(user)
      request = supertest.agent(session.app)
    })

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

      await request.get(`/api/admin/users/${user._id}`)
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

      await request.get(`/api/admin/users/${user._id}`)
        .expect(400)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.message).to.equal(`UserId ${user._id} not found`)
        })
    })

  })

  describe('updating a user', function() {
















    it('updates the database', async function(){
      const user = await User.create({
        firstName: 'first',
        lastName: 'last',
        email: '123@example.com',
        roles: [],
        provider: 'local',
        password: '12345678'
      })

      const adminUser = createTestUser('admin', ADMIN_ROLE)
      const adminSession = await createUserSession(adminUser)
      const adminReq = supertest.agent(adminSession.app)

      const requestBody = {
        _id: user._id,
        created: user.created,
        displayName: user.displayName,
        email: 'new.email@example.com',
        firstName: 'newFirstName',
        lastName: 'newLastName',
        provider: user.provider,
        roles: user.roles,
        updated: user.updated
      }

      await adminReq.put(`/api/admin/users/${user._id}`).send(requestBody).expect(200)

      const updatedUser = await User.findById(requestBody._id).lean()
      expect(updatedUser).to.have.property('_id', requestBody._id)
      expect(updatedUser).to.have.property('email', requestBody.email)
      expect(updatedUser).to.have.property('firstName', requestBody.firstName)
      expect(updatedUser).to.have.property('lastName', requestBody.lastName)
    })





    it('returns the updated user object', async function(){
      const user = await User.create({
        firstName: 'first',
        lastName: 'last',
        email: '123@example.com',
        roles: [],
        provider: 'local',
        password: '12345678'
      })

      const adminUser = createTestUser('admin', ADMIN_ROLE)
      const adminSession = await createUserSession(adminUser)
      const adminReq = supertest.agent(adminSession.app)

      const requestBody = {
        _id: user._id,
        created: user.created,
        displayName: user.displayName,
        email: 'new.email@example.com',
        firstName: 'newFirstName',
        lastName: 'newLastName',
        provider: user.provider,
        roles: user.roles,
        updated: user.updated
      }

      await adminReq.put(`/api/admin/users/${user._id}`).send(requestBody)
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('_id', requestBody._id)
          expect(res.body).to.have.property('email', requestBody.email)
          expect(res.body).to.have.property('firstName', requestBody.firstName)
          expect(res.body).to.have.property('lastName', requestBody.lastName)
        })
    })

    it('admins can set other users as admins', async function(){
      const user = await User.create({
        firstName: 'first',
        lastName: 'last',
        email: '123@example.com',
        roles: [],
        provider: 'local',
        password: '12345678'
      })

      const adminUser = createTestUser('admin', ADMIN_ROLE)
      const adminSession = await createUserSession(adminUser)
      const adminReq = supertest.agent(adminSession.app)

      await adminReq.put(`/api/admin/users/${user._id}`)
        .send({ isAdmin: true })
        .expect(200)

      const updatedUser = await User.findById(user._id).lean()
      expect(updatedUser).to.have.property('roles')
      expect(updatedUser.roles).to.include(ADMIN_ROLE)
    })

    // see https://github.com/freeCodeCamp/pantry-for-good/issues/347
    it('regular users cannot update another user profile', async function(){
      const user1 = await User.create({
        firstName: 'first',
        lastName: 'last',
        email: '123@example.com',
        roles: [],
        provider: 'local',
        password: '12345678'
      })

      const user2 = await User.create({
        firstName: 'first2',
        lastName: 'last2',
        email: '345@example.com',
        roles: [],
        provider: 'local',
        password: '12345678'
      })
      const user2Session = await createUserSession(user2)
      const user2Req = supertest.agent(user2Session.app)

      const requestBody = {
        _id: user1._id,
        created: user1.created,
        displayName: user1.displayName,
        email: 'new.email@example.com',
        firstName: 'newFirstName',
        lastName: 'newLastName',
        provider: user1.provider,
        roles: user1.roles,
        updated: user1.updated
      }

      await user2Req.put(`/api/admin/users/${user1._id}`).send(requestBody).expect(403)

      const updatedUser = await User.findById(user1._id).lean()
      expect(updatedUser).to.have.property('_id', user1._id)
      expect(updatedUser).to.have.property('email', user1.email)
      expect(updatedUser).to.have.property('firstName', user1.firstName)
      expect(updatedUser).to.have.property('lastName', user1.lastName)
    })
  })

  describe('updating profile', function() {
    it('regular users can update their own profile', async function(){
      const user = await User.create({
        firstName: 'first',
        lastName: 'last',
        email: '123@example.com',
        roles: [],
        provider: 'local',
        password: '12345678'
      })

      const userSession = await createUserSession(user)
      const userReq = supertest.agent(userSession.app)

      const requestBody = {
        _id: user._id,
        created: user.created,
        displayName: user.displayName,
        email: 'new.email@example.com',
        firstName: 'newFirstName',
        lastName: 'newLastName',
        provider: user.provider,
        roles: user.roles,
        updated: user.updated
      }

      await userReq.put('/api/users/me').send(requestBody).expect(200)

      const updatedUser = await User.findById(user._id).lean()
      expect(updatedUser).to.have.property('email', requestBody.email)
      expect(updatedUser).to.have.property('firstName', requestBody.firstName)
      expect(updatedUser).to.have.property('lastName', requestBody.lastName)
    })

    it('update ignores req.body properties: displayName, provider, salt, resetPasswordToken and roles', async function(){
      const user = await User.create({
        firstName: 'first',
        lastName: 'last',
        email: '123@example.com',
        roles: [],
        provider: 'local',
        password: '12345678'
      })

      const userBeforeUpdate = await User.findById(user._id)

      const userSession = await createUserSession(user)
      const userReq = supertest.agent(userSession.app)

      const requestBody = {
        _id: user._id,
        email: 'new.email@example.com',
        firstName: 'newFirstName',
        lastName: 'newLastName',
        displayName: 'xxxxxx',
        provider: 'xxxxxx',
        salt: 'xxxxxx',
        resetPasswordToken: 'xxxxxx',
        resetPasswordExpires: 'xxxxxx',
        roles: 'xxxxxx',
      }

      await userReq.put('/api/users/me').send(requestBody).expect(200)

      const userAfterUpdate = await User.findById(user._id)

      expect(userAfterUpdate).to.have.property('email', requestBody.email)
      expect(userAfterUpdate).to.have.property('firstName', requestBody.firstName)
      expect(userAfterUpdate).to.have.property('lastName', requestBody.lastName)
      expect(userAfterUpdate).to.have.property('salt', userBeforeUpdate.salt)
      expect(userAfterUpdate).to.have.property('provider', userBeforeUpdate.provider)
      expect(userAfterUpdate).to.have.property('resetPasswordToken', userBeforeUpdate.resetPasswordToken)
      expect(userAfterUpdate).to.have.property('resetPasswordExpires', userBeforeUpdate.resetPasswordExpires)
    })

    it('regular users cannot make themselves admins', async function(){
      const user = await User.create({
        firstName: 'first',
        lastName: 'last',
        email: '123@example.com',
        roles: [],
        provider: 'local',
        password: '12345678'
      })

      const userSession = await createUserSession(user)
      const userReq = supertest.agent(userSession.app)

      await userReq.put('/api/users/me')
        .send({ isAdmin: true })
        .expect(200)

      const updatedUser = await User.findById(user._id).lean()
      expect(updatedUser).to.have.property('roles')
      expect(updatedUser.roles).to.not.include(ADMIN_ROLE)
    })
  })

  describe('users notifications', function() {
    it('function for creating an admin notifications', async function(){
      await User.create({
        firstName: 'first',
        lastName: 'last',
        email: '123@example.com',
        roles: [ADMIN_ROLE],
        provider: 'local',
        password: '12345678'
      })

      // Sent Notifications
      await searchUserAndSetNotification('roles/admin', {message:`Customer customer test was created!`, url: `/customers/2018`}, 2018)

      const request = supertest.agent(app())
      return await request.post('/api/auth/signin')
        .send({email: '123@example.com', password: '12345678'})
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('notifications')
          expect(res.body.notifications[0]).to.have.property('message')
          expect(res.body.notifications[0]).to.have.property('url')
          expect(res.body.notifications[0]).to.have.property('date')
          expect(res.body.notifications[0].message).to.equal('Customer customer test was created!')
        })
    })
  })
})
