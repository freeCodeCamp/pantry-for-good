import {utc} from 'moment'

import * as reducer from './reducer'
import {CALL_API} from '../../store/middleware/api'
import {customer as customerSchema, arrayOfCustomers} from '../../../common/schemas'

describe('customer reducer', function() {
  describe('action creators', function() {
    it('loads all customers', function() {
      const action = reducer.loadCustomers()

      expect(action).to.have.property(CALL_API)
      const {endpoint, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('admin/customer')
      expect(schema).to.equal(arrayOfCustomers)
      expect(types.length).to.equal(3)
    })

    it('loads a customer', function() {
      const action = reducer.loadCustomer(1)

      expect(action).to.have.property(CALL_API)
      const {endpoint, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('customer/1')
      expect(schema).to.equal(customerSchema)
      expect(types.length).to.equal(3)
    })

    it('saves a customer', function() {
      const action = reducer.saveCustomer({_id: 1})

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('customer/1')
      expect(method).to.equal('PUT')
      expect(body).to.eql({_id: 1})
      expect(schema).to.equal(customerSchema)
      expect(types.length).to.equal(3)
    })

    it('deletes a customer', function() {
      const action = reducer.deleteCustomer(1)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('admin/customers/1')
      expect(method).to.equal('DELETE')
      expect(schema).to.equal(customerSchema)
      expect(types.length).to.equal(3)
    })
  })

  describe('selectors', function() {
    let selectors, state
    const lastWeek = new Date().setDate(new Date().getDate() - 7)

    before(function() {
      selectors = reducer.createSelectors('customer')
      state = {
        customer: {ids: [1, 2, 3]},
        entities: {
          customers: {
            1: {_id: 1, status: 'Accepted', lastPacked: utc().startOf('isoWeek')},
            2: {_id: 2, status: 'Accepted', lastPacked: utc(lastWeek).startOf('isoWeek')},
            3: {_id: 3, status: 'Pending', lastPacked: utc().startOf('isoWeek')}
          }
        }
      }
    })

    it('getAll', function() {
      const result = selectors.getAll(state)
      expect(result).to.be.an('array')
      expect(result.length).to.equal(3)
      expect(result[0]).to.eql(state.entities.customers[1])
    })

    it('getOne', function() {
      const result = selectors.getOne(state)(1)
      expect(result).to.be.an('object')
      expect(result).to.eql(state.entities.customers[1])
    })

    it('getScheduled', function() {
      const result = selectors.getScheduled(state)
      expect(result).to.be.an('array')
      expect(result.length).to.equal(1)
      expect(result[0]).to.eql(state.entities.customers[2])
    })
  })
})
