import * as reducer from './media'
import {CALL_API} from '../../../store/middleware/api'

describe('media reducer', function() {
  describe('action creators', function() {
    it('loads media', function() {
      const action = reducer.loadMedia()

      expect(action).to.have.property(CALL_API)
      const {endpoint, types} = action[CALL_API]

      expect(endpoint).to.equal('media')
      expect(types.length).to.equal(3)
    })

    it('saves media', function() {
      const dispatchMock = sinon.spy()
      const responseMock = {
        json: sinon.stub().resolves({data: 'data'}),
        ok: true
      }
      const fetchMock = sinon.stub().resolves(responseMock)
      reducer.default.__Rewire__('fetch', fetchMock)

      const result = reducer.saveMedia('fooType', 'fooFile')(dispatchMock)
      reducer.default.__ResetDependency__('fetch')

      let formData = new window.FormData()
      formData.append('fooType', 'fooFile')

      expect(dispatchMock).to.have.been.calledWith({type: reducer.SAVE_REQUEST})
      expect(fetchMock).to.have.been.calledWithMatch('/api/admin/media/upload', {
        method: 'POST',
        body: formData
      })

      return result.then(() => {
        expect(responseMock.json).to.have.been.calledOnce
        expect(dispatchMock.secondCall).to.have.been.calledWithMatch({
          type: reducer.SAVE_SUCCESS,
          response: {data: 'data'}
        })
      })
    })

    it('handles save errors', function() {
      const dispatchMock = sinon.spy()
      const responseMock = {
        json: sinon.stub().rejects({error: 'err'}),
        ok: false
      }
      const fetchMock = sinon.stub().resolves(responseMock)
      reducer.default.__Rewire__('fetch', fetchMock)

      const result = reducer.saveMedia('fooType', 'fooFile')(dispatchMock)
      reducer.default.__ResetDependency__('fetch')

      return result.then(() => {
        expect(responseMock.json).to.have.been.calledOnce
        expect(dispatchMock.secondCall).to.have.been.calledWithMatch({
          type: reducer.SAVE_FAILURE,
          error: {error: 'err'}
        })
      })
    })
  })

  describe('reducer', function() {
    it('sets fetching state', function() {
      const state = reducer.default(null, {type: reducer.LOAD_REQUEST})
      expect(state).to.eql({
        fetching: true,
        fetchError: null
      })
    })

    it('adds response data', function() {
      const state = reducer.default(null, {type: reducer.LOAD_SUCCESS, response: 'foo'})
      expect(state).to.eql({
        fetching: false,
        data: 'foo'
      })
    })

    it('sets error state', function() {
      const state = reducer.default(null, {type: reducer.LOAD_FAILURE, error: 'foo'})
      expect(state).to.eql({
        fetching: false,
        fetchError: 'foo'
      })
    })
  })

  describe('selectors', function() {
    it('creates selectors', function() {
      const selectors = reducer.createSelectors('media')
      const state = {media: {data: 'foo'}}
      expect(selectors.getMedia(state)).to.equal('foo')
      expect(selectors).to.include.keys(['loading', 'saving', 'loadError'])
    })
  })
})
