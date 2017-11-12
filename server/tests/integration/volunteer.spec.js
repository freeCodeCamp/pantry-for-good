import {
  ADMIN_ROLE,
  clientRoles,
  questionnaireIdentifiers
} from '../../../common/constants'
import {createUserSession, createTestUser} from '../helpers'
import User from '../../models/user'
import Questionnaire from '../../models/questionnaire'
import Volunteer from '../../models/volunteer'

describe('Volunteer Api', function() {
  before(async function() {
    await initDb()
    await Volunteer.find().remove()
    await User.find().remove()
    await Questionnaire.find().remove()
    await new Questionnaire({
      name: 'Volunteer Application',
      identifier: questionnaireIdentifiers.VOLUNTEER
    }).save()
  })

  afterEach(async function() {
    await Volunteer.find().remove()
    await User.find().remove()
  })

  after(async function() {
    await Questionnaire.find().remove()
    await resetDb()
  })

  describe('User routes', function() {
    it('creates volunteers', async function() {
      const testVolunteer = createTestUser('user', clientRoles.VOLUNTEER)
      const {user, app} = await createUserSession(testVolunteer)
      const request = supertest.agent(app)

      return request.post('/api/volunteer')
        .send(user)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status', 'Pending')
        })
        .expect(200)
    })

    it('shows a volunteer', async function() {
      const testVolunteer = createTestUser('user', clientRoles.VOLUNTEER)
      const {user, app} = await createUserSession(testVolunteer)
      const request = supertest.agent(app)

      const newVolunteer = (await request.post('/api/volunteer')
        .send(user)).body

      return request.get(`/api/volunteer/${newVolunteer._id}`)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status', 'Pending')
        })
        .expect(200)
    })

    it('updates a volunteer', async function() {
      const testVolunteer = createTestUser('user', clientRoles.VOLUNTEER)
      const {user, app} = await createUserSession(testVolunteer)
      const request = supertest.agent(app)

      const newVolunteer = (await request.post('/api/volunteer')
        .send(user)).body

      const updatedVolunteer = {
        ...newVolunteer,
        firstName: 'updated'
      }

      return request.put(`/api/volunteer/${updatedVolunteer._id}`)
        .send(updatedVolunteer)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('firstName', 'updated')
        })
        .expect(200)
    })
  })

  describe('Admin routes', function() {
    it('lists volunteers', async function() {
      const testVolunteer = createTestUser('user', clientRoles.VOLUNTEER)
      const testAdmin = createTestUser('admin', ADMIN_ROLE)

      const volunteer = await createUserSession(testVolunteer)
      const admin = await createUserSession(testAdmin)

      const volunteerRequest = supertest.agent(volunteer.app)
      const adminRequest = supertest.agent(admin.app)

      await volunteerRequest.post('/api/volunteer')
        .send(volunteer.user)

      return adminRequest.get('/api/admin/volunteers')
        .expect(res => {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.length(1)
          expect(res.body[0]).to.have.property('firstName', 'user')
        })
        .expect(200)
    })

    it('deletes volunteers', async function() {
      const testVolunteer = createTestUser('user', clientRoles.VOLUNTEER)
      const testAdmin = createTestUser('admin', ADMIN_ROLE)

      const volunteer = await createUserSession(testVolunteer)
      const admin = await createUserSession(testAdmin)

      const volunteerRequest = supertest.agent(volunteer.app)
      const adminRequest = supertest.agent(admin.app)

      const newVolunteer = (await volunteerRequest.post('/api/volunteer')
        .send(volunteer.user)).body

      return adminRequest.delete(`/api/admin/volunteers/${newVolunteer._id}`)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('firstName', 'user')
        })
        .expect(200)
    })
  })
})
