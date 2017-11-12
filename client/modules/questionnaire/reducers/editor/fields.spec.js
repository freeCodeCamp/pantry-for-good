import * as qEditor from './index'
import fieldReducer from './fields'

describe('questionnaire editor field reducer', function() {
  let initialState
  before(function() {
    initialState = {
      byId: {1: {_id: 1}, 2: {_id: 2}},
      allIds: [1, 2]
    }
  })

  it('initializes with fields', function() {
    const state = fieldReducer(null, {
      type: qEditor.actions.INIT,
      fields: {1: {_id: 1}, 2: {_id: 2}}
    })

    expect(state.allIds).to.eql(['1', '2'])
    expect(state.byId).to.have.keys(['1', '2'])
  })

  it('adds a field', function() {
    const state = fieldReducer(initialState, {
      type: qEditor.actions.ADD_FIELD,
      field: {_id: 3}
    })

    expect(state.allIds).to.eql([1, 2, 3])
    expect(state.byId).to.have.keys(['1', '2', '3'])
  })

  it('deletes a field', function() {
    const state = fieldReducer(initialState, {
      type: qEditor.actions.DELETE_FIELD,
      fieldId: 2
    })

    expect(state.allIds).to.eql([1])
  })

  it('updates a field', function() {
    const state = fieldReducer(initialState, {
      type: qEditor.actions.UPDATE_FIELD,
      field: {_id: 2, type: 'foo'}
    })

    expect(state.allIds).to.eql([1, 2])
    expect(state.byId[2]).to.eql({_id: 2, type: 'foo'})
  })
})
