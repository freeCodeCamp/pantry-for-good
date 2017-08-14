import * as reducer from './donor'
import {CALL_API} from '../../../store/middleware/api'
import {donor as donorSchema, arrayOfDonors} from '../../../../common/schemas'

describe('donor reducer', function() {
  describe('action creators', function() {
    it('loads all donors', function() {
      const action = reducer.loadDonors()

      expect(action).to.have.property(CALL_API)
      const {endpoint, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('admin/donors')
      expect(schema).to.equal(arrayOfDonors)
      expect(types.length).to.equal(3)
    })

    it('loads a donor', function() {
      const action = reducer.loadDonor(1, true)

      expect(action).to.have.property(CALL_API)
      const {endpoint, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('admin/donors/1')
      expect(schema).to.equal(donorSchema)
      expect(types.length).to.equal(3)
    })

    it('saves a donor', function() {
      const action = reducer.saveDonor({_id: 1}, true)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('admin/donors/1')
      expect(method).to.equal('PUT')
      expect(body).to.eql({_id: 1})
      expect(schema).to.equal(donorSchema)
      expect(types.length).to.equal(3)
    })

    it('deletes a donor', function() {
      const action = reducer.deleteDonor(1)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('admin/donors/1')
      expect(method).to.equal('DELETE')
      expect(schema).to.equal(donorSchema)
      expect(types.length).to.equal(3)
    })
  })

  describe('selectors', function() {
    let state, selectors

    before(function() {
      selectors = reducer.createSelectors('donor')
      state = {
        donor: {ids: [1, 2]},
        entities: {
          donors: {1: {id: 1}, 2: {id: 2}}
        }
      }
    })

    it('getAll', function() {
      const result = selectors.getAll(state)
      expect(result).to.be.an('array')
      expect(result.length).to.equal(2)
      expect(result[0]).to.eql({id: 1})
    })

    it('getOne', function() {
      const result = selectors.getOne(state)(1)
      expect(result).to.be.an('object')
      expect(result).to.eql({id: 1})
    })
  })
})
