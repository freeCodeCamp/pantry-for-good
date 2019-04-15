const sinon = require('sinon')
const sandbox = sinon.createSandbox()
import settingsCtrl from './settings'
import Settings from '../models/settings'
import {ADMIN_ROLE, volunteerRoles} from '../../common/constants'

describe('Settings controller', function() {
  describe('save', function() {
    let res = {}

    beforeEach(function() {
      res = {
        json: sandbox.spy()
      }
    })

    afterEach(function() {
      sandbox.restore()
    })

    it('should update requested setting if requested setting already exists and return the saved setting', async function() {
      const req = {
        user: {
          roles: [ ADMIN_ROLE ]
        },
        body: {}
      }

      const dummyLoc = {
        lat: 0,
        lng: 0
      }
      settingsCtrl.__Rewire__('locateAddress', () => dummyLoc)

      const dummyCount = 1
      sandbox.stub(Settings, 'count').returns(dummyCount)

      const savedSettings = {
        gmapsApiKey: 'abcdef',
        gmapsClientId: 'xyz'
      }
      const mockFindByIdAndUpdate = {
        findByIdAndUpdate: sandbox.stub().returnsThis,
        select: sandbox.stub().returns(savedSettings)
      }

      const settingsFindByIdAndUpdateStub = sandbox.stub(Settings, 'findByIdAndUpdate').returns(mockFindByIdAndUpdate)
      sandbox.stub(Settings, 'create').returns(mockFindByIdAndUpdate)

      await settingsCtrl.save(req, res)

      settingsCtrl.__ResetDependency__('locateAddress')

      expect(settingsFindByIdAndUpdateStub.calledOnce).to.be.true
      expect(res.json.calledWith(sinon.match(savedSettings)))
    })

    it('should update requested setting if requested setting already exists and return the saved setting', async function() {
      const req = {
        user: {
          roles: [ ADMIN_ROLE ]
        },
        body: {}
      }

      const dummyLoc = {
        lat: 0,
        lng: 0
      }
      settingsCtrl.__Rewire__('locateAddress', () => dummyLoc)

      const dummyCount = 0
      sandbox.stub(Settings, 'count').returns(dummyCount)

      const savedSettings = {
        gmapsApiKey: 'abcdef',
        gmapsClientId: 'xyz'
      }
      const mockFindByIdAndUpdate = {
        findByIdAndUpdate: sandbox.stub().returnsThis,
        select: sandbox.stub().returns(savedSettings)
      }

      sandbox.stub(Settings, 'findByIdAndUpdate').returns(mockFindByIdAndUpdate)
      const settingsCreateStub = sandbox.stub(Settings, 'create').returns(mockFindByIdAndUpdate)

      await settingsCtrl.save(req, res)

      settingsCtrl.__ResetDependency__('locateAddress')

      expect(settingsCreateStub.calledOnce).to.be.true
      expect(res.json.calledWith(sinon.match(savedSettings)))
    })

    it('should throw ForbiddenError if user does not admin role', async function() {
      const req = {
        user: {
          roles: [ volunteerRoles ]
        },
        body: {}
      }
      const settingsSaveSpy = sandbox.spy(settingsCtrl.save)

      try {
        await settingsCtrl.save(req, res)
      } catch(e) {
        // do nothing       
      }

      sinon.assert.pass(settingsSaveSpy.threw('ForbiddenError'))
    })
    it('should throw ValidationError if requested address does not have a valid location', async function() {
      const req = {
        user: {
          roles: [ ADMIN_ROLE ]
        },
        body: {}
      }

      const dummyLoc = null
      settingsCtrl.__Rewire__('locateAddress', () => dummyLoc)

      const settingsSaveSpy = sandbox.spy(settingsCtrl.save)

      try {
        await settingsCtrl.save(req, res)
      } catch(e) {
        // do nothing
      }

      sinon.assert.pass(settingsSaveSpy.threw('ValidationError'))
    })
  })
})