import {
  questionnaireIdentifiers,
  clientRoles,
} from '../../../common/constants'
import Donor from '../../models/donor'
import Donation from '../../models/donation'
import Questionnaire from '../../models/questionnaire'
import User from '../../models/user'
import {createUserSession, createTestUser} from '../helpers'

describe('Donation Api', function() {
  before(async function() {
    await initDb()
    await Donor.find().remove()
    await User.find().remove()
    await new Questionnaire({
      name: 'Donor Application',
      identifier: questionnaireIdentifiers.DONOR
    }).save()
  })

  afterEach(async function() {
    await Donor.find().remove()
    await User.find().remove()
    await Donation.find().remove()
  })

  after(async function() {
    await Questionnaire.find().remove()
    await resetDb()
  })

  describe('User routes', function() {
    it('creates donations', async function() {
      const testDonor = await createTestUser('user', clientRoles.DONOR)
      const {user, app} = await createUserSession(testDonor)
      const request = supertest.agent(app)
      const donor = await Donor.create({
        ...user,
        _id: user.id,
      })

      const items = [
        {name: 'Potatoes', value: 10},
        {name: 'Carrots', value: 5,},
        {name: 'Spaghetti', value: 5,},
      ]

      const donation = {
        donor: donor._id,
        description: 'User Donation',
        items: items,
      }

      return request.post('/api/donations')
        .send(donation)
        .expect(res => {
          expect(res.body.donor).to.be.an('object')
          expect(res.body.donor).to.have.property('_id', donor._id)
          expect(res.body.donation).to.be.an('object')
          expect(res.body.donation).to.have.property('total', 20)
          expect(res.body.donation).to.have.property('description', donation.description)
          expect(res.body.donation.items).to.be.deep.eql(items)
        })
        .expect(200)
    })

    it('unauthorized to create donation', async function() {
      const testDonor = await createTestUser('userdonor', clientRoles.DONOR)
      const testDonor2 = await createTestUser('userdonor2', clientRoles.DONOR)
      const firstSession = await createUserSession(testDonor)
      const secondSession = await createUserSession(testDonor2)
      const request = supertest.agent(firstSession.app)

      const donor2 = await Donor.create({
        ...secondSession.user,
        _id: secondSession.user.id,
      })

      const donation = {
        donor: donor2._id,
        description: 'User Donation',
        items: [
          {name: 'Potatoes', value: 10},
        ]
      }

      return request.post('/api/donations')
        .send(donation)
        .expect(401)
    })

  })
})
