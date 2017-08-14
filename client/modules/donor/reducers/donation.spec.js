import * as reducer from './donation'
import {
  donation as donationSchema,
  donor as donorSchema
} from '../../../../common/schemas'

describe('donation reducer', function() {
  describe('action creators', function() {
    it('approveDonation', function() {
      const dispatchMock = sinon.spy()
      const response = {
        result: {donations: 1},
        entities: {
          donations: {1: {_id: 1}}
        }
      }

      const callApiMock = sinon.stub().resolves(response)
      reducer.default.__Rewire__('callApi', callApiMock)

      const result = reducer.approveDonation(1)(dispatchMock)
      reducer.default.__ResetDependency__('callApi')

      expect(dispatchMock.firstCall).to.have.been.calledWith({
        type: reducer.APPROVE_DONATION_REQUEST
      })

      expect(callApiMock).to.have.been.calledWith('admin/donations/1/approve', 'PUT', null, null, donationSchema)

      return result.then(() => {
        expect(dispatchMock.secondCall).to.have.been.calledWithMatch({
          type: reducer.APPROVE_DONATION_SUCCESS,
          response
        })
      })
    })

    it('saveDonation', function() {
      const dispatchMock = sinon.spy()
      const response = {
        result: {
          donations: 1,
          donors: 1
        },
        entities: {
          donations: {1: {_id: 1}},
          donors: {1: {_id: 1}}
        }
      }

      const callApiMock = sinon.stub().resolves(response)
      reducer.default.__Rewire__('callApi', callApiMock)

      const result = reducer.saveDonation({_id: 1}, {_id: 1})(dispatchMock)
      reducer.default.__ResetDependency__('callApi')

      expect(dispatchMock.firstCall).to.have.been.calledWith({
        type: reducer.SAVE_DONATION_REQUEST
      })

      expect(callApiMock).to.have.been.calledWith('donations', 'POST', {
        _id: 1,
        donor: 1
      }, null, {
        donation: donationSchema,
        donor: donorSchema
      })

      return result.then(() => {
        expect(dispatchMock.secondCall).to.have.been.calledWithMatch({
          type: reducer.SAVE_DONATION_SUCCESS,
          response
        })
      })
    })

    it('sendReceipt', function() {
      const dispatchMock = sinon.spy()
      const response = {
        result: {donations: 1},
        entities: {
          donations: {1: {_id: 1, donor: 1}}
        }
      }
      const callApiMock = sinon.stub().resolves(response)
      reducer.default.__Rewire__('callApi', callApiMock)

      const result = reducer.sendReceipt(1)(dispatchMock)
      reducer.default.__ResetDependency__('callApi')

      expect(dispatchMock.firstCall).to.have.been.calledWith({
        type: reducer.RECEIPT_DONATION_REQUEST
      })

      expect(callApiMock).to.have.been.calledWith('donations/1', 'PUT', null, null, donationSchema)

      return result.then(() => {
        expect(dispatchMock.secondCall).to.have.been.calledWithMatch({
          type: reducer.RECEIPT_DONATION_SUCCESS,
          response
        })
      })
    })
  })

  describe('reducer', function() {
    it('adds new donation ids', function() {
      const initialState = {ids: [1, 2]}
      const state = reducer.default(initialState, {
        type: reducer.SAVE_DONATION_SUCCESS,
        response: {result: {donations: 3}}
      })

      expect(state.ids).to.be.an('array')
      expect(state.ids.length).to.equal(3)
      expect(state.ids[2]).to.equal(3)
    })
  })

  describe('selectors', function() {
    let state, selectors

    before(function() {
      selectors = reducer.createSelectors('donation')
      state = {
        donation: {ids: [1, 2]},
        entities: {
          donations: {1: {_id: 1}, 2: {_id: 2}}
        }
      }
    })

    it('getAll', function() {
      const result = selectors.getAll(state)
      expect(result).to.be.an('array')
      expect(result.length).to.equal(2)
      expect(result[0]).to.eql({_id: 1})
    })

    it('getOne', function() {
      const result = selectors.getOne(state)(1)
      expect(result).to.be.an('object')
      expect(result).to.eql({_id: 1})
    })
  })
})
