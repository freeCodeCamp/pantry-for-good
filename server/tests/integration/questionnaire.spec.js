import Questionnaire from '../../models/questionnaire'
import {ADMIN_ROLE, questionnaireIdentifiers} from '../../../common/constants'
import{createTestUser, createUserSession} from '../helpers'

describe('Questionnaire Api', function() {
  before(async function() {
    await initDb()
    await Questionnaire.find().remove()
    await new Questionnaire({
      name: 'Customer Application',
      identifier: questionnaireIdentifiers.CUSTOMER,
    }).save()
  })

  afterEach(async function() {
    await Questionnaire.find().remove()
  })

  after(async function() {
    await Questionnaire.find().remove()
    await resetDb()
  })

  describe('User routes', function() {
    it('lists questionnaires', async function() {
      const testAdmin = createTestUser('admin', ADMIN_ROLE)
      const admin = await createUserSession(testAdmin)
      const request = supertest.agent(admin.app)

      return request.get('/api/questionnaires')
        .expect(res => {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.length(1)
          expect(res.body[0]).to.have.property('name', 'Customer Application')
          expect(res.body[0]).to.have.property('identifier', questionnaireIdentifiers.CUSTOMER)
        })
        .expect(200)
    })
  })
})
