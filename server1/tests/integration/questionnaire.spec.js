import Questionnaire from '../../models/questionnaire'
import User from '../../models/user'
import {
  ADMIN_ROLE,
  questionnaireIdentifiers,
  fieldTypes,
} from '../../../common/constants'
import{createTestUser, createUserSession} from '../helpers'

describe('Questionnaire Api', function() {
  before(async function() {
    await initDb()
    await Questionnaire.find().remove()
    await User.find().remove()
  })

  afterEach(async function() {
    await Questionnaire.find().remove()
    await User.find().remove()
  })

  after(async function() {
    await Questionnaire.find().remove()
    await User.find().remove()
    await resetDb()
  })

  describe('User routes', function() {
    it('lists questionnaires', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const admin = await createUserSession(testAdmin)
      const request = supertest.agent(admin.app)

      const newQuestionnaire = await new Questionnaire({
        name: 'Customer Application',
        identifier: questionnaireIdentifiers.CUSTOMER,
      }).save()

      return request.get('/api/questionnaires')
        .expect(res => {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.length(1)
          expect(res.body[0]).to.have.property('_id', newQuestionnaire.id)
          expect(res.body[0]).to.have.property('name', 'Customer Application')
          expect(res.body[0]).to.have.property('identifier', questionnaireIdentifiers.CUSTOMER)
        })
        .expect(200)
    })
    it('shows a questionnaire', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const admin = await createUserSession(testAdmin)
      const request = supertest.agent(admin.app)

      const newQuestionnaire = await new Questionnaire({
        name: 'Customer Application',
        identifier: questionnaireIdentifiers.CUSTOMER,
      }).save()

      return request.get(`/api/questionnaires/${newQuestionnaire._id}`)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.name).to.equal(newQuestionnaire.name)
          expect(res.body.identifier).to.equal(newQuestionnaire.identifier)
        })
        .expect(200)
    })
    it('doesn\'t show non-existing questionnaires', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const admin = await createUserSession(testAdmin)
      const request = supertest.agent(admin.app)

      const notSavedQuestionnaire = new Questionnaire({
        name: 'Customer Application',
        identifier: questionnaireIdentifiers.CUSTOMER,
      })

      return request.get(`/api/questionnaires/${notSavedQuestionnaire._id}`)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message', 'Not found')
        })
        .expect(404)
    })
    it('updates a questionnaire', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const admin = await createUserSession(testAdmin)
      const request = supertest.agent(admin.app)

      const section = {
        name: 'Section Info',
        fields: [{
          type: fieldTypes.TEXT, label: 'Section Field'
        }]
      }

      const newSection = {
        name: 'New Section Info',
        fields: [{
          type: fieldTypes.TEXT, label: 'New Section Field'
        }]
      }

      const savedQuestionnaire = await new Questionnaire({
        name: 'Customer Application',
        identifier: questionnaireIdentifiers.CUSTOMER,
        sections: [section]
      }).save()

      const updatedQuestionnaire = {sections: [newSection]}

      return request.put(`/api/questionnaires/${savedQuestionnaire._id}`)
        .send(updatedQuestionnaire)
        .expect(res => {
          expect(res.body).to.be.an('object')
          // Check section change
          expect(res.body.sections[0]).to.have.property('name', 'New Section Info')
          // Check field change
          expect(res.body.sections[0].fields[0]).to.have.property('label', 'New Section Field')
        })
        .expect(200)
    })
  })
})
