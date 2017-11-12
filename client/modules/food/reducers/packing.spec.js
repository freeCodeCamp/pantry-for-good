import * as reducer from './packing'

describe('packing reducer', function() {
  describe('action creators', function() {
    it('packs', function() {
      const response = {
        result: {
          packages: [1],
          customers: [1],
          foodItems: [1]
        },
        entities: {
          packages: [{_id: 1}],
          customers: [{_id: 1}],
          foodItems: [{_id: 1}]
        }
      }

      const dispatchMock = sinon.spy()
      const callApiMock = sinon.stub().resolves(response)
      reducer.default.__Rewire__('callApi', callApiMock)

      const newPackedCustomers = [{customer: 1, contents: [1]}]
      const result = reducer.pack(newPackedCustomers)(dispatchMock)
      reducer.default.__ResetDependency__('callApi')

      expect(dispatchMock.firstCall).to.have.been.calledWith({
        type: reducer.PACK_REQUEST
      })

      expect(callApiMock).to.have.been.calledWith('packing', 'POST', newPackedCustomers)

      return result.then(() => {
        expect(dispatchMock.secondCall).to.have.been.calledWithMatch({
          type: reducer.PACK_SUCCESS,
          response
        })
      })
    })

    it('unpacks', function() {
      const response = {
        result: {
          packages: 1,
          customers: 1,
          foodItems: [1]
        },
        entities: {
          packages: {1: {_id: 1}},
          customers: {1: {_id: 1}},
          foodItems: {1: {_id: 1}}
        }
      }

      const dispatchMock = sinon.spy()
      const callApiMock = sinon.stub().resolves(response)
      reducer.default.__Rewire__('callApi', callApiMock)

      const result = reducer.unpackPackage(1)(dispatchMock)
      reducer.default.__ResetDependency__('callApi')

      expect(dispatchMock.firstCall).to.have.been.calledWith({
        type: reducer.UNPACK_REQUEST
      })

      expect(callApiMock).to.have.been.calledWith('packing', 'DELETE', {_id: 1})

      return result.then(() => {
        expect(dispatchMock.secondCall).to.have.been.calledWithMatch({
          type: reducer.UNPACK_SUCCESS,
          response
        })
      })
    })
  })

  describe('reducer', function() {
    it('sets loading flag', function() {
      const state = reducer.default(null, {
        type: reducer.LOAD_REQUEST
      })
      expect(state).to.eql({
        loading: true,
        loadError: null
      })
    })

    it('adds packed package ids', function() {
      const initialState = {ids: [1, 2]}
      const state = reducer.default(initialState, {
        type: reducer.PACK_SUCCESS,
        response: {result: {packages: [3]}}
      })
      expect(state.ids).to.eql([1, 2, 3])
    })

    it('removes unpacked package ids', function() {
      const initialState = {ids: [1, 2]}
      const state = reducer.default(initialState, {
        type: reducer.UNPACK_SUCCESS,
        response: {result: {packages: 2}}
      })
      expect(state.ids).to.eql([1])
    })
  })

  describe('selectors', function() {
    it('packages gets packed packages', function() {
      const state = {
        packing: {ids: [1, 2]},
        entities: {
          packages: {1: {_id: 1}, 2: {_id: 2}}
        }
      }
      const selectors = reducer.createSelectors('packing')
      const packages = selectors.packages(state)

      expect(packages).to.eql([{_id: 1}, {_id: 2}])
    })
  })
})
