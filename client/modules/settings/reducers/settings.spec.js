import {CALL_API} from '../../../store/middleware/api'
import * as reducer from './settings'

describe('settings reducer', function() {
  describe('action creators', function() {
    it('loads settings', function() {
      const action = reducer.loadSettings()

      expect(action).to.have.property(CALL_API)
      const {endpoint, types} = action[CALL_API]

      expect(endpoint).to.equal('settings')
      expect(types.length).to.equal(3)
    })

    it('saves settings', function() {
      const settings = {foo: 'foo'}
      const action = reducer.saveSettings(settings)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, types} = action[CALL_API]

      expect(endpoint).to.equal('settings')
      expect(method).to.equal('POST')
      expect(body).to.equal(settings)
      expect(types.length).to.equal(3)
    })
  })

  describe('reducer', function() {
    it('sets fetching flag', function() {
      const state = reducer.default(null, {type: reducer.LOAD_REQUEST})
      expect(state).to.eql({
        fetching: true,
        error: null,
        success: null
      })
    })

    it('adds loaded data', function() {
      const state = reducer.default(null, {type: reducer.LOAD_SUCCESS, response: 'foo'})
      expect(state).to.eql({
        fetching: false,
        success: true,
        data: 'foo'
      })
    })

    it('sets error flag', function() {
      const state = reducer.default(null, {type: reducer.LOAD_FAILURE, error: 'foo'})
      expect(state).to.eql({
        fetching: false,
        error: 'foo',
      })
    })
  })

  describe('selectors', function() {
    it('creates selectors', function() {
      const selectors = reducer.createSelectors('settings')
      const state = {settings: {data: 'foo'}}
      expect(selectors.getSettings(state)).to.equal('foo')
      expect(selectors).to.include.keys(['fetching', 'error'])
    })
  })
})
