import {values} from 'lodash'
import {utc} from 'moment'

import * as reducer from './item'
// import {pageTypes, pageIdentifiers} from '../../../common/constants'
import {foodItem, foodCategory} from '../../../../common/schemas'
import {CALL_API} from '../../../store/middleware/api'

describe('food item reducer', function() {
  describe('action creators', function() {
    it('saves a new food item', function() {
      const action = reducer.saveFoodItem(1, {name: 'foo'})

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, schema, responseSchema, types} = action[CALL_API]

      expect(endpoint).to.equal('foods/1/items')
      expect(method).to.equal('POST')
      expect(body).to.eql({name: 'foo'})
      expect(schema).to.equal(foodItem)
      expect(responseSchema).to.equal(foodCategory)
      expect(types.length).to.equal(3)
    })

    it('saves an existing food item', function() {
      const action = reducer.saveFoodItem(1, {_id: 1})

      expect(action).to.have.property(CALL_API)
      const {endpoint, method} = action[CALL_API]

      expect(endpoint).to.equal('foods/1/items/1')
      expect(method).to.equal('PUT')
    })
  })

  describe('reducer', function() {
    it('sets saving state', function() {
      const state = reducer.default(null, {type: reducer.actions.SAVE_REQUEST})
      expect(state).to.eql({
        saving: true,
        saveError: null
      })
    })

    it('sets error state', function() {
      const state = reducer.default(null, {
        type: reducer.actions.SAVE_FAILURE,
        error: 'foo'
      })
      expect(state).to.eql({
        saving: false,
        saveError: 'foo'
      })
    })

    it('adds saved item ids', function() {
      const initialState = {ids: ['1', '2']}
      const response = {
        entities: {
          foodItems: {3: {_id: 3}}
        }
      }

      const state = reducer.default(initialState, {
        type: reducer.actions.SAVE_SUCCESS,
        response
      })

      expect(state.ids).to.eql(['1', '2', '3'])
    })

    it('removes deleted item ids', function() {
      const initialState = {ids: ['1', '2']}
      const response = {deletedItemId: '2'}

      const state = reducer.default(initialState, {
        type: reducer.actions.DELETE_SUCCESS,
        response
      })

      expect(state.ids).to.eql(['1'])
    })
  })

  describe('selectors', function() {
    let state, selectors
    const lastWeek = new Date().setDate(new Date().getDate() - 7)

    before(function() {
      state = {
        entities: {
          foodItems: {
            1: {_id: 1, frequency: 1, startDate: utc().startOf('isoWeek')},
            2: {_id: 2, frequency: 2, startDate: utc(lastWeek).startOf('isoWeek')},
            3: {_id: 3, frequency: 2, startDate: utc().startOf('isoWeek')}
          }
        },
        item: {ids: [1, 2, 3]}
      }

      selectors = reducer.createSelectors('item')
    })

    it('getAll', function() {
      const selected = selectors.getAll(state)
      expect(selected).to.be.an('array')
      expect(selected).to.eql(values(state.entities.foodItems))
    })

    it('getOne', function() {
      const selected = selectors.getOne(state)(2)
      expect(selected).to.be.an('object')
      expect(selected).to.have.property('_id', 2)
    })

    it('getScheduled', function() {
      const selected = selectors.getScheduled(state)
      expect(selected).to.be.an('array')
      expect(selected.length).to.equal(2)
      expect(selected).to.eql([state.entities.foodItems[1], state.entities.foodItems[3]])
    })
  })
})
