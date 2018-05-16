import * as reducer from './authReducer'
import {CALL_API} from '../../store/middleware/api'

import { notification as notificationSchema } from '../../../common/schemas'

describe('auth reducer', function() {
  describe('action creators', function() {

    it('removes a notification', function() {
      const action = reducer.deleteNotification(0)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('/users/me/notifications?id=0')
      expect(method).to.equal('DELETE')
      expect(schema).to.eql(notificationSchema)
      expect(types.length).to.equal(3)
    })

    it('removes all notifications', function() {
      const action = reducer.deleteAllNotifications()

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('/users/me/notifications?id=')
      expect(method).to.equal('DELETE')
      expect(schema).to.eql(notificationSchema)
      expect(types.length).to.equal(3)
    })

    it('saves users profile', function() {
      const user = {_id: 1, name: 'foo'}
      const action = reducer.setProfile(user)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, types} = action[CALL_API]

      expect(endpoint).to.equal('users/me')
      expect(method).to.equal('PUT')
      expect(body).to.equal(user)
      expect(types.length).to.equal(3)
    })

    it('saves users password', function() {
      const user = {password: 'foo'}
      const action = reducer.setPassword(user)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, types} = action[CALL_API]

      expect(endpoint).to.equal('users/password')
      expect(method).to.equal('POST')
      expect(body).to.equal(user)
      expect(types.length).to.equal(3)
    })

    it('calls forgot password', function() {
      const user = {email: 'foo@example.com'}
      const action = reducer.forgotPassword(user)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, types} = action[CALL_API]

      expect(endpoint).to.equal('auth/forgot')
      expect(method).to.equal('POST')
      expect(body).to.equal(user)
      expect(types.length).to.equal(3)
    })

    it('resets users password', function() {
      const password = 'foo'
      const action = reducer.resetPassword(123, password)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, types} = action[CALL_API]

      expect(endpoint).to.equal('auth/reset/123')
      expect(method).to.equal('POST')
      expect(body).to.eql({password})
      expect(types.length).to.equal(3)
    })

    it('signs up', function() {
      const user = {email: 'foo@example.com'}
      const action = reducer.signUp(user)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, types} = action[CALL_API]

      expect(endpoint).to.equal('auth/signup')
      expect(method).to.equal('POST')
      expect(body).to.equal(user)
      expect(types.length).to.equal(3)
    })

    it('signs in', function() {
      const user = {email: 'foo@example.com'}
      const action = reducer.signIn(user)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, types} = action[CALL_API]

      expect(endpoint).to.equal('auth/signin')
      expect(method).to.equal('POST')
      expect(body).to.equal(user)
      expect(types.length).to.equal(3)
    })
  })
  describe('reducer', function() {
    it('handles request types', function() {
      const state = reducer.default(null, {type: reducer.SET_PROFILE_REQUEST})
      expect(state).to.eql({
        success: null,
        error: null,
        fetching: true
      })
    })

    it('handles success types', function() {
      const state = reducer.default(null, {
        type: reducer.SET_PROFILE_SUCCESS,
        response: 'foo'
      })
      expect(state).to.eql({
        success: true,
        error: null,
        fetching: false,
        user: 'foo'
      })
    })

    it('handles failure types', function() {
      const state = reducer.default(null, {
        type: reducer.SET_PROFILE_FAILURE,
        error: 'foo'
      })
      expect(state).to.eql({
        success: null,
        error: 'foo',
        fetching: false,
      })
    })
  })

  describe('selectors', function() {
    it('creates selectors', function() {
      const selectors = reducer.createSelectors('auth')
      expect(selectors).to.be.an('object')
      expect(selectors).to.include.keys(['getUser', 'fetching'])
    })
  })
})
