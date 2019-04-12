import {
  searchUserAndSetNotification,
  searchVolunteerAndSetNotification,
  default as notification_sender
} from './notification-sender'
import User from '../models/user'
import Volunteer from '../models/volunteer'
import {clientRoles} from '../../common/constants'

const sandbox = require('sinon').createSandbox()

describe('Notification sender', function() {
  describe('searchUserAndSetNotification', function() {
    let dummy_users = null
    let roleU = null
    let notification = null
    let setNotification = null

    beforeEach(function() {
      dummy_users = [
        {
          "_id" : 10003,
          "firstName" : "Una",
          "lastName" : "Deckow",
          "roles" : [
            clientRoles.CUSTOMER
          ],
          "email" : "customer7@example.com"
        },
        {
          "_id" : 10022,
          "firstName" : "dummy",
          "lastName" : "dummy",
          "roles" : [
            clientRoles.CUSTOMER
          ],
          "email" : "volunteer5@example.com"
        },
        {
          "_id" : 10015,
          "firstName" : "Fernando",
          "lastName" : "Cummerata",
          "roles" : [
            clientRoles.CUSTOMER
          ],
          "email" : "customer25@example.com"
        }]
      roleU = clientRoles.CUSTOMER
      notification = {}

      // stub setNotification function before every test to avoid running db update
      setNotification = sandbox.stub()
      notification_sender.__Rewire__('setNotification', setNotification)
    })

    afterEach(function() {
      notification_sender.__ResetDependency__('setNotification')
      sandbox.restore()

    })

    it('should call setNotification 3 times with 3 matching users and 3 matching roles', async function() {
      sandbox.stub(User, 'find').resolves(dummy_users)   // stub User.find db query
      await searchUserAndSetNotification(roleU, notification)

      sandbox.assert.callCount(setNotification, dummy_users.length)
    })

    it('should call setNotification 2 times with 3 matching users and 2 matching roles', async function() {  	
      dummy_users[1].roles[0] = clientRoles.VOLUNTEER
      sandbox.stub(User, 'find').resolves(dummy_users)   // stub User.find db query
      await searchUserAndSetNotification(roleU, notification)

      sandbox.assert.callCount(setNotification, 2)
    })

    it('should call setNotification 0 times with 0 matching users', async function() {
      dummy_users = []
      sandbox.stub(User, 'find').resolves(dummy_users)   // stub User.find db query
      await searchUserAndSetNotification(roleU, notification)

      sandbox.assert.callCount(setNotification, 0)
    })
  })

  describe('searchVolunteerAndSetNotification', function() {
    let dummy_volunteers = null
    let setNotification = null
    let notification = null
    const customerId = 10051    

    beforeEach(function() {
      dummy_volunteers = [{
        "_id": 10001,
        "customers" : [ 10051, 10052, 10053 ],
        "firstName" : "Annamae",
        "lastName" : "Kuphal"
      }, {
        "_id": 10002,
        "customers" : [ 10051, 10055, 10056 ],
        "firstName" : "tester1",
        "lastName" : "tester1"
      }, {
        "_id": 10003,    	
        "customers" : [ 10051, 10058, 10059 ],
        "firstName" : "tester2",
        "lastName" : "tester2"
      }]
      notification = {}

      // stub setNotification function before every test to avoid running db update
      setNotification = sandbox.stub()
      notification_sender.__Rewire__('setNotification', setNotification)
    })

    afterEach(function() {
      notification_sender.__ResetDependency__('setNotification')
      sandbox.restore()
    })

    it('should call setNotification 3 times with 3 matching volunteers each with 1 matching customer id', async function() {
      sandbox.stub(Volunteer, 'find').resolves(dummy_volunteers)   // stub Volunteer find db query
      await searchVolunteerAndSetNotification(notification, customerId)

      sandbox.assert.callCount(setNotification, 3)
    })

    it('should call setNotification 2 times with 3 matching volunteers with 2 volunteers having 1 matching customer id and 1 volunteer with 0 matching id', async function() {
      dummy_volunteers[1].customers = [ 10052, 10055, 10056 ]
      sandbox.stub(Volunteer, 'find').resolves(dummy_volunteers)
      await searchVolunteerAndSetNotification(notification, customerId)

      sandbox.assert.callCount(setNotification, 2)
    })

    it('should call setNotification 0 times with 0 matching volunteers', async function() {
      dummy_volunteers = []
      sandbox.stub(Volunteer, 'find').resolves(dummy_volunteers)
      await searchVolunteerAndSetNotification(notification, customerId)

      sandbox.assert.callCount(setNotification, 0)
    })

    it('should call setNotification 0 times with 3 matching volunteers each with 0 customers', async function() {
      dummy_volunteers[0].customers = []
      dummy_volunteers[1].customers = []
      dummy_volunteers[2].customers = []

      sandbox.stub(Volunteer, 'find').resolves(dummy_volunteers)
      await searchVolunteerAndSetNotification(notification, customerId)

      sandbox.assert.callCount(setNotification, 0)
    })
  })
})