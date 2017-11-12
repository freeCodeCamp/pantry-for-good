import {inRange as _inRange} from 'lodash'
import * as reducer from './assignment'

describe('assignment reducer', function() {
  describe('action creators', function() {

    const cluster = {
      getBounds(){ return { contains: function(position){
        return inRange(position)
      } }}
    }

    it('selectCluster selects unselected customers', function() {
      const customers = [
        {_id: 1, location: {lat: 1, lng: 1}},
        {_id: 2, location: {lat: 6, lng: 6}},
        {_id: 3, location: {lat: 8, lng: 8}}
      ]

      const action = reducer.selectCluster(cluster, customers, [])
      expect(action).to.eql({
        type: reducer.SELECT_CUSTOMERS,
        customers: [2, 3]
      })
    })

    it('selectCluster selects partially selected customers', function() {
      const customers = [
        {_id: 1, location: {lat: 1, lng: 1}},
        {_id: 2, location: {lat: 6, lng: 6}},
        {_id: 3, location: {lat: 8, lng: 8}}
      ]

      const action = reducer.selectCluster(cluster, customers, [2])
      expect(action).to.eql({
        type: reducer.SELECT_CUSTOMERS,
        customers: [2, 3]
      })
    })

    it('selectCluster deselects when all selected', function() {
      const customers = [
        {_id: 1, location: {lat: 1, lng: 1}},
        {_id: 2, location: {lat: 6, lng: 6}},
        {_id: 3, location: {lat: 8, lng: 8}}
      ]

      const action = reducer.selectCluster(cluster, customers, [2, 3])
      expect(action).to.eql({
        type: reducer.SELECT_CUSTOMERS,
        customers: []
      })
    })

    it('assign customers', function() {
      const dispatchMock = sinon.spy()
      const response = {
        entities: {
          customers: {1: {_id: 1}, 2: {_id: 2}},
          volunteers: {1: {_id: 1}}
        }
      }

      const callApiMock = sinon.stub().resolves(response.entities)
      reducer.default.__Rewire__('callApi', callApiMock)

      const result = reducer.assignCustomers([1, 2], 1)(dispatchMock)
      reducer.default.__ResetDependency__('callApi')

      expect(dispatchMock.firstCall).to.have.been.calledWith({
        type: reducer.ASSIGN_REQUEST
      })

      expect(callApiMock).to.have.been.calledWith('admin/delivery/assign', 'POST', {
        customerIds: [1, 2],
        driverId: 1
      })

      return result.then(() => {
        expect(dispatchMock.secondCall).to.have.been.calledWithMatch({
          type: reducer.ASSIGN_SUCCESS,
          response
        })
      })
    })
  })

  describe('reducer', function() {
    it('sets selected customers', function() {
      const initialState = {selectedCustomers: []}
      const firstState = reducer.default(initialState, {
        type: reducer.SELECT_CUSTOMERS,
        customers: [1]
      })
      const secondState = reducer.default(firstState, {
        type: reducer.SELECT_CUSTOMERS,
        customers: [{_id: 2}]
      })

      expect(firstState.selectedCustomers).to.be.an('array')
      expect(firstState.selectedCustomers).to.eql([1])
      expect(secondState.selectedCustomers).to.eql([2])
    })

    it('toggles customer selection', function() {
      const initialState = {selectedCustomers: [1, 2]}
      const firstState = reducer.default(initialState, {
        type: reducer.TOGGLE_SELECT_CUSTOMER,
        customerId: 3
      })
      const secondState = reducer.default(firstState, {
        type: reducer.TOGGLE_SELECT_CUSTOMER,
        customerId: 1
      })

      expect(firstState.selectedCustomers).to.be.an('array')
      expect(firstState.selectedCustomers).to.eql([1, 2, 3])
      expect(secondState.selectedCustomers).to.eql([2, 3])
    })
  })

  describe('selectors', function() {
    let selectors, state

    before(function() {
      const customerSelectors = {
        getAll() { return [{_id: 1, assignedTo: 1}, {_id: 2}]}
      }
      selectors = reducer.createSelectors('delivery', customerSelectors)
      state = {
        delivery: {
          selectedFilter: 'unassigned',
          selectedDriver: 1,
          selectedCustomers: [1]
        }
      }
    })

    it('getFilteredCustomers', function() {
      const result = selectors.getFilteredCustomers(state)
      expect(result).to.eql([{_id: 2}])
    })

    it('isCustomerSelected', function() {
      const result1 = selectors.isCustomerSelected(state)(1)
      const result2 = selectors.isCustomerSelected(state)(2)
      expect(result1).to.be.true
      expect(result2).to.be.false
    })
  })
})

function inRange({lat, lng}) {
  return _inRange(lat, 5, 10) && _inRange(lng, 5, 10)
}
