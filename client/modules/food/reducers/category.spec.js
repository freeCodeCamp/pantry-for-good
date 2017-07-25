import {values} from 'lodash'

import * as reducer from './category'
import {foodCategory, arrayOfFoodCategories} from '../../../../common/schemas'
import {CALL_API} from '../../../store/middleware/api'

describe('food category reducer', function() {
  describe('action creators', function() {
    it('loads all foods', function() {
      const action = reducer.loadFoods()

      expect(action).to.have.property(CALL_API)
      const {endpoint, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('foods')
      expect(schema).to.equal(arrayOfFoodCategories)
      expect(types.length).to.equal(3)
    })

    it('saves a new food category', function() {
      const action = reducer.saveFood({name: 'foo'})

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('foods')
      expect(method).to.equal('POST')
      expect(body).to.eql({name: 'foo'})
      expect(schema).to.equal(foodCategory)
      expect(types.length).to.equal(3)
    })

    it('saves an existing food category', function() {
      const action = reducer.saveFood({_id: 1})

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('foods/1')
      expect(method).to.equal('PUT')
      expect(body).to.eql({_id: 1})
      expect(schema).to.equal(foodCategory)
      expect(types.length).to.equal(3)
    })

    it('deletes a food category', function() {
      const action = reducer.deleteFood(1)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('foods/1')
      expect(method).to.equal('DELETE')
      expect(schema).to.equal(foodCategory)
      expect(types.length).to.equal(3)
    })
  })

  describe('selectors', function() {
    let state, selectors
    before(function() {
      state = {
        entities: {
          foodCategories: {
            1: {_id: 1},
            2: {_id: 2}
          }
        },
        category: {ids: [1, 2]}
      }

      selectors = reducer.createSelectors('category')
    })

    it('getAll', function() {
      const selected = selectors.getAll(state)
      expect(selected).to.be.an('array')
      expect(selected).to.eql(values(state.entities.foodCategories))
    })

    it('getOne', function() {
      const selected = selectors.getOne(state)(1)
      expect(selected).to.be.an('object')
      expect(selected).to.eql(values(state.entities.foodCategories)[0])
    })
  })
})
