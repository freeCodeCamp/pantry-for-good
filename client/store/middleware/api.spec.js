import {
  default as getApiMiddleware,
  __RewireAPI__ as rewireAPI,
  callApi,
  CALL_API
} from './api'

describe('api middleware', function() {
  describe('callApi', function() {
    beforeEach(function() {
      rewireAPI.__Rewire__('API_ROOT', 'root/')
    })

    afterEach(function() {
      rewireAPI.__ResetDependency__('API_ROOT')
      rewireAPI.__ResetDependency__('fetch')
      rewireAPI.__ResetDependency__('normalize')
      rewireAPI.__ResetDependency__('formatRequestBody')
    })

    it('GETs', function() {
      const responseMock = {
        json: sinon.stub().resolves({data: 'data'}),
        ok: true
      }

      const fetchMock = sinon.stub().resolves(responseMock)
      rewireAPI.__Rewire__('fetch', fetchMock)

      const result = callApi('foo')

      expect(fetchMock).to.calledWithMatch('root/foo', {
        method: 'GET',
        body: undefined,
        credentials: 'same-origin'
      })

      return result.then(res => {
        expect(res).to.eql({data: 'data'})
        expect(responseMock.json).to.have.been.calledOnce
      })
    })

    it('rejects if response not ok', function() {
      const responseMock = {
        json: sinon.stub().resolves({error: 'error'}),
        ok: false
      }

      const fetchMock = sinon.stub().resolves(responseMock)
      rewireAPI.__Rewire__('fetch', fetchMock)

      const result = callApi('foo')

      expect(fetchMock).to.calledWith('root/foo')

      return result.catch(err => {
        expect(err).to.include({error: 'error'})
        expect(responseMock.json).to.have.been.calledOnce
      })
    })

    it('POSTs', function() {
      const responseMock = {
        json: sinon.stub().resolves({data: 'data'}),
        ok: true
      }

      const fetchMock = sinon.stub().resolves(responseMock)
      const normalizeMock = sinon.stub().returnsArg(0)
      const formatRequestBodyMock = sinon.stub().returnsArg(0)

      rewireAPI.__Rewire__('fetch', fetchMock)
      rewireAPI.__Rewire__('normalize', normalizeMock)
      rewireAPI.__Rewire__('formatRequestBody', formatRequestBodyMock)

      const result = callApi('foo', 'POST', {body: 'foo'}, 'schema')

      expect(fetchMock).to.have.been.calledWithMatch('root/foo', {
        method: 'POST',
        body: {body: 'foo'},
        credentials: 'same-origin'
      })
      expect(formatRequestBodyMock).to.have.been.calledOnce

      return result.then(res => {
        expect(res).to.eql({data: 'data'})
        expect(responseMock.json).to.have.been.calledOnce
        expect(normalizeMock).to.have.been.calledWith({data: 'data'}, 'schema')
      })
    })
  })

  describe('formatRequestBody', function() {
    let formatRequestBody

    before(function() {
      formatRequestBody = rewireAPI.__get__('formatRequestBody')
    })

    it('json encodes body', function() {
      const body = {body: 'foo'}
      const formatted = formatRequestBody(body)
      expect(formatted).to.equal(JSON.stringify(body))
    })

    it('normalizes entities', function() {
      const body = {id: 1, type: 'customer'}
      const normalized = {
        result: 1,
        entities: {
          customer: {'1': body}
        }
      }
      const schema = {_key: 'customer'}

      const normalizeMock = sinon.stub().returns(normalized)
      rewireAPI.__Rewire__('normalize', normalizeMock)

      const formatted = formatRequestBody(body, 'POST', schema)
      rewireAPI.__ResetDependency__('normalize')

      expect(formatted).to.equal(JSON.stringify(body))
      expect(normalizeMock).to.have.been.calledWith(body, schema)
    })

    it('throws if body contains multiple entities', function() {
      const normalized = {
        result: [1, 2],
        entities: {
          customer: {'1': {id: 1}, '2': {id: 2}}
        }
      }
      const schema = {_key: 'customer'}

      const normalizeMock = sinon.stub().returns(normalized)
      rewireAPI.__Rewire__('normalize', normalizeMock)

      expect(() => formatRequestBody('body', 'POST', schema)).to.throw()
      rewireAPI.__ResetDependency__('normalize')
    })

    it('throws if PUT request and no entity id', function() {
      const normalized = {
        result: undefined,
        entities: {
          customer: {'undefined': {}}
        }
      }
      const schema = {_key: 'customer'}

      const normalizeMock = sinon.stub().returns(normalized)
      rewireAPI.__Rewire__('normalize', normalizeMock)

      expect(() => formatRequestBody('body', 'PUT', schema)).to.throw()
      rewireAPI.__ResetDependency__('normalize')
    })
  })

  describe('generateRequestHeaders', function() {
    let generateRequestHeaders

    before(function() {
      generateRequestHeaders = rewireAPI.__get__('generateRequestHeaders')
    })

    it('returns blank headers for GET', function() {
      const headers = generateRequestHeaders('GET')
      expect(headers).to.eql(new Headers({}))
    })

    it('adds websocket client id', function() {
      rewireAPI.__Rewire__('_socket', {id: 1})
      const headers = generateRequestHeaders('POST')

      rewireAPI.__ResetDependency__('_socket')
      expect(headers).to.eql(new Headers({
        'Content-Type': 'application/json',
        'Socket-ID': '1'
      }))
    })
  })

  describe('middleware', function() {
    it('saves websocket client id', function() {
      getApiMiddleware({id: 1})
      const socket = rewireAPI.__get__('_socket')
      expect(socket).to.eql({id: 1})
    })

    it('forwards other actions', function() {
      const next = sinon.spy()
      const action = {type: 'foo'}
      getApiMiddleware()()(next)(action)
      expect(next).to.have.been.calledWith(action)
    })

    it('dispatches a request type action', function() {
      const next = sinon.spy()
      const action = {
        [CALL_API]: {
          endpoint: 'foo',
          types: ['request', 'success', 'failure']
        }
      }
      const callApiMock = sinon.stub().resolves()
      rewireAPI.__Rewire__('callApi', callApiMock)

      getApiMiddleware()()(next)(action)
      rewireAPI.__ResetDependency__('callApi')

      expect(next).to.have.been.calledWith({type: 'request'})
    })

    it('dispatches a success type action', function() {
      const next = sinon.spy()
      const action = {
        [CALL_API]: {
          endpoint: 'foo',
          types: ['request', 'success', 'failure']
        }
      }

      const callApiMock = sinon.stub().resolves('success')
      rewireAPI.__Rewire__('callApi', callApiMock)

      const called = getApiMiddleware()()(next)(action)
      rewireAPI.__ResetDependency__('callApi')

      return called.then(() => {
        expect(next.secondCall).to.have.been.calledWith({type: 'success', response: 'success'})
      })
    })

    it('dispatches a failure type action', function() {
      const next = sinon.spy()
      const action = {
        [CALL_API]: {
          endpoint: 'foo',
          types: ['request', 'success', 'failure']
        }
      }

      const callApiMock = sinon.stub().rejects({message: 'failure'})
      rewireAPI.__Rewire__('callApi', callApiMock)

      const called = getApiMiddleware()()(next)(action)
      rewireAPI.__ResetDependency__('callApi')

      return called.then(() => {
        expect(next.secondCall).to.have.been.calledWith({type: 'failure', error: {message: 'failure'}})
      })
    })

    it('throws a SubmissionError', function() {
      const next = sinon.spy()
      const action = {
        [CALL_API]: {
          endpoint: 'foo',
          types: ['request', 'success', 'failure']
        },
        meta: {submitValidate: true}
      }

      const callApiMock = sinon.stub().rejects({message: 'failure', paths: 'foo'})
      rewireAPI.__Rewire__('callApi', callApiMock)

      const called = getApiMiddleware()()(next)(action)
      rewireAPI.__ResetDependency__('callApi')

      return called.catch(err => {
        expect(err).to.have.property('errors', 'foo')
      })
    })
  })
})
