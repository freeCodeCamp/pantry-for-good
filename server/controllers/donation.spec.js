const sinon = require('sinon')
const sandbox = sinon.createSandbox()
import Donation from '../models/donation'
import Donor from '../models/donor'
import donationCtrl from './donation'

describe('Donation controller', function() {
  let res = {}

  before(function() {
    res = {
      json: sandbox.spy()
    }
  })

  after(function() {
    res = {}
  })

  describe('create', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should return created donation and donor objects', async function() {
      const req = {
        body: {
          donor: 99999,
          description: 'User Donation',
          items: [ { name: 'Potatoes', value: 10 },
            { name: 'Carrots', value: 5 },
            { name: 'Spaghetti', value: 5 }
          ]
        },
        user: {
          firstName: 'admin',
          lastName: 'test',
          roles: [ 'roles/admin' ],
          created: Date.now,
          notifications: [],
          _id: 99999,
          email: 'admin@test.com',
          provider: 'local',
          __v: 0
        }
      }
      const dummyDonation = {
        approved: false,
        donor: 99999,
        description: 'User Donation',
        items: [ { name: 'Potatoes', value: 10 } ],
        total: 10,
        dateReceived: Date.now,
        _id: 99999,
        __v: 0
      }
      const dummyDonor = {
        donations: [ 231 ],
        fields: [],
        dateReceived: Date.now,
        _id: 99999,
        __v: 0
      }

      const customerSaveStub = sandbox.stub(Donation, 'create').returns(dummyDonation)
      const donarFindByIdAndUpdateStub = sandbox.stub(Donor, 'findByIdAndUpdate').returns(dummyDonor)
      donationCtrl.__Rewire__('mailer', {
        sendThanks: donation => donation
      })

      await donationCtrl.create(req, res)

      donationCtrl.__ResetDependency__('mailer')

      sinon.assert.calledOnce(customerSaveStub)
      sinon.assert.calledOnce(donarFindByIdAndUpdateStub)
      sinon.assert.calledWith(res.json, sinon.match.has("donation"))
      sinon.assert.calledWith(res.json, sinon.match.has("donor"))
    })
  })

  describe('approve', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should return donation object requested for approval', async function() {
      const req = {
        params: {
          donationId: '273'
        }
      }
      const dummyDonation = {
        _id: 99999,
        donor: {
          firstName: 'userdonor',
          lastName: 'test',
          _id: 99999
        }
      }
      const mockFindByIdAndUpdate = {
        populate: sandbox.stub().returns(dummyDonation)
      }
      const donationFindByIdAndUpdateStub = sandbox.stub(Donation, 'findByIdAndUpdate').returns(mockFindByIdAndUpdate)
      donationCtrl.__Rewire__('mailer', {
        sendReceipt: donation => donation
      })

      await donationCtrl.approve(req, res)

      donationCtrl.__ResetDependency__('mailer')

      sinon.assert.calledOnce(donationFindByIdAndUpdateStub)
      sinon.assert.calledWith(res.json, sinon.match({ _id: 99999 }))
    })
  })

  describe('sendEmail', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should return donation object for email', function() {
      const req = {
        params: {
          donationId: '273'
        }
      }
      const dummyDonation = {
        _id: 99999,
        donor: {
          firstName: 'userdonor',
          lastName: 'test',
          _id: 99999
        }
      }
      const mockFindById = {
        populate: sandbox.stub().returns(dummyDonation)
      }
      const donationFindByIdStub = sandbox.stub(Donation, 'findById').returns(mockFindById)
      donationCtrl.__Rewire__('mailer', {
        sendReceipt: donation => donation
      })

      donationCtrl.sendEmail(req, res)

      donationCtrl.__ResetDependency__('mailer')

      sinon.assert.calledOnce(donationFindByIdStub)
      sinon.assert.calledWith(res.json, sinon.match({ _id: 99999 }))
    })
  })
})