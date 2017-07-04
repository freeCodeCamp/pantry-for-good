import {ADMIN_ROLE, clientRoles, questionnaireIdentifiers} from '../../../common/constants'
import Donor from '../../models/donor'
import {createUserSession, createTestUser} from '../helpers'
import User from '../../models/user'
import Questionnaire from '../../models/questionnaire'

describe('Donor Api', function() {
  before(async function() {
    await initDb()
    await Donor.find().remove()
    await User.find().remove()
    await Questionnaire.find().remove()
    await new Questionnaire({
      name: 'Donor Application',
      identifier: questionnaireIdentifiers.DONOR
    }).save()
  })

  afterEach(async function() {
    await Donor.find().remove()
    await User.find().remove()
  })

  after(async function() {
    await Questionnaire.find().remove()
    await resetDb()
  })

  describe('User routes', function() {
    it('creates donors', async function() {
      const testDonor = createTestUser('user', clientRoles.DONOR)
      const {user, app} = await createUserSession(testDonor)
      const request = supertest.agent(app)

      return request.post('/api/donor')
        .send(user)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('firstName', 'user')
        })
        .expect(200)
    })

    it('shows a donor', async function() {
      const testDonor = createTestUser('user', clientRoles.DONOR)
      const {user, app} = await createUserSession(testDonor)
      const request = supertest.agent(app)

      const newDonor = (await request.post('/api/donor')
        .send(user)).body

      return request.get(`/api/donor/${newDonor._id}`)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('firstName', 'user')
        })
        .expect(200)
    })

    it('updates a donor', async function() {
      const testDonor = createTestUser('user', clientRoles.DONOR)
      const {user, app} = await createUserSession(testDonor)
      const request = supertest.agent(app)

      const newDonor = (await request.post('/api/donor')
        .send(user)).body

      const updatedDonor = {
        ...newDonor,
        firstName: 'updated'
      }

      return request.put(`/api/donor/${newDonor._id}`)
        .send(updatedDonor)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('firstName', 'updated')
        })
        .expect(200)
    })
  })

  describe('Admin routes', function() {
    it('lists donors', async function() {
      const testDonor = createTestUser('user', clientRoles.DONOR)
      const testAdmin = createTestUser('admin', ADMIN_ROLE)

      const donor = await createUserSession(testDonor)
      const admin = await createUserSession(testAdmin)

      const donorRequest = supertest.agent(donor.app)
      const adminRequest = supertest.agent(admin.app)

      await donorRequest.post('/api/donor')
        .send(donor.user)

      return adminRequest.get('/api/admin/donors')
        .expect(res => {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.length(1)
          expect(res.body[0]).to.have.property('firstName', 'user')
        })
        .expect(200)
    })

    it('deletes a donor', async function() {
      const testDonor = createTestUser('user', clientRoles.DONOR)
      const testAdmin = createTestUser('admin', ADMIN_ROLE)

      const donor = await createUserSession(testDonor)
      const admin = await createUserSession(testAdmin)

      const donorRequest = supertest.agent(donor.app)
      const adminRequest = supertest.agent(admin.app)

      const newDonor = (await donorRequest.post('/api/donor')
        .send(donor.user)).body

      return adminRequest.delete(`/api/admin/donors/${newDonor._id}`)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('firstName', 'user')
        })
        .expect(200)
    })
  })
})
