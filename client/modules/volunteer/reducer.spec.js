import {values} from 'lodash'

import {volunteerRoles} from '../../../common/constants'
import {volunteer as volunteerSchema, arrayOfVolunteers} from '../../../common/schemas'
import * as reducer from './reducer'
import {CALL_API} from '../../store/middleware/api'

describe('volunteer reducer', function() {
  describe('action creators', function() {
    it('loads all volunteers', function() {
      const action = reducer.loadVolunteers()

      expect(action).to.have.property(CALL_API)
      const {endpoint, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('admin/volunteers')
      expect(schema).to.equal(arrayOfVolunteers)
      expect(types.length).to.equal(3)
    })

    it('loads a volunteer', function() {
      const action = reducer.loadVolunteer(1)

      expect(action).to.have.property(CALL_API)
      const {endpoint, schema, types} = action[CALL_API]
      expect(endpoint).to.equal('volunteer/1')
      expect(schema).to.equal(volunteerSchema)
      expect(types.length).to.equal(3)
    })

    it('loads a volunteer as admin', function() {
      const action = reducer.loadVolunteer(1, true)
      const {endpoint} = action[CALL_API]

      expect(endpoint).to.equal('admin/volunteers/1')
    })

    it('saves a new volunteer', function() {
      const volunteer = {type: 'volunteer'}
      const action = reducer.saveVolunteer(volunteer)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, schema, types} = action[CALL_API]
      expect(endpoint).to.equal('volunteer')
      expect(method).to.equal('POST')
      expect(body).to.equal(volunteer)
      expect(schema).to.equal(volunteerSchema)
      expect(types.length).to.equal(3)
    })

    it('saves an existing volunteer', function() {
      const volunteer = {_id: 1, type: 'volunteer'}
      const action = reducer.saveVolunteer(volunteer)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method} = action[CALL_API]
      expect(endpoint).to.equal('volunteer/1')
      expect(method).to.equal('PUT')
    })

    it('saves a volunteer as admin', function() {
      const volunteer = {_id: 1, type: 'volunteer'}
      const action = reducer.saveVolunteer(volunteer, true)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method} = action[CALL_API]
      expect(endpoint).to.equal('admin/volunteers/1')
      expect(method).to.equal('PUT')
    })

    it('deletes a volunteer', function() {
      const action = reducer.deleteVolunteer(1)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, schema, types} = action[CALL_API]
      expect(endpoint).to.equal('admin/volunteers/1')
      expect(method).to.equal('DELETE')
      expect(schema).to.equal(volunteerSchema)
      expect(types.length).to.equal(3)
    })
  })

  describe('selectors', function() {
    let selectors, state

    before(function() {
      selectors = reducer.createSelectors('volunteers')
      state = {
        entities: {
          volunteers: {
            1: {_id: 1, status: 'Active', user: {roles: [volunteerRoles.DRIVER]}},
            2: {_id: 2, status: 'Active', user: {roles: [volunteerRoles.DRIVER]}},
            3: {_id: 3, status: 'Active', user: {roles: [volunteerRoles.INVENTORY]}}
          }
        },
        volunteers: {ids: [1, 2, 3]}
      }
    })

    it('getAll', function() {
      const volunteers = selectors.getAll(state)
      expect(volunteers).to.eql(values(state.entities.volunteers))
    })

    it('getAll memoizes', function() {
      selectors.getAll(state)
      selectors.getAll(state)

      expect(selectors.getAll.recomputations()).to.equal(1)
    })

    it('getAllDrivers', function() {
      const drivers = selectors.getAllDrivers(state)
      expect(drivers).to.eql(values(state.entities.volunteers).filter(v => v._id < 3))
    })

    it('getOne', function() {
      const volunteer = selectors.getOne(state)(2)
      expect(volunteer).to.eql(state.entities.volunteers[2])
    })
  })
})
