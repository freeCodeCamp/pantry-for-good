import * as qEditor from './index'
import sectionReducer from './sections'

describe('questionnaire editor section reducer', function() {
  let initialState
  before(function() {
    initialState = {
      byId: {1: {_id: 1}, 2: {_id: 2}},
      allIds: [1, 2]
    }
  })

  it('initializes with sections', function() {
    const state = sectionReducer(null, {
      type: qEditor.actions.INIT,
      sections: {1: {_id: 1}, 2: {_id: 2}}
    })

    expect(state.allIds).to.eql(['1', '2'])
    expect(state.byId).to.have.keys(['1', '2'])
  })

  it('adds a section', function() {
    const state = sectionReducer(initialState, {
      type: qEditor.actions.ADD_SECTION,
      section: {_id: 3}
    })

    expect(state.allIds).to.eql([1, 2, 3])
    expect(state.byId).to.have.keys(['1', '2', '3'])
  })

  it('deletes a section', function() {
    const state = sectionReducer(initialState, {
      type: qEditor.actions.DELETE_SECTION,
      sectionId: 2
    })

    expect(state.allIds).to.eql([1])
  })

  it('updates a section', function() {
    const state = sectionReducer(initialState, {
      type: qEditor.actions.UPDATE_SECTION,
      section: {_id: 2, type: 'foo'}
    })

    expect(state.allIds).to.eql([1, 2])
    expect(state.byId[2]).to.eql({_id: 2, type: 'foo'})
  })

  it('moves a section', function() {
    const state = sectionReducer(initialState, {
      type: qEditor.actions.MOVE_SECTION,
      sectionId: 2,
      idx: 0
    })

    expect(state.allIds).to.eql([2, 1])
  })

  it('moves a field', function() {
    const initialState = {
      byId: {
        1: {_id: 1, fields: [1, 2]}
      },
      allIds: [1]
    }

    const state = sectionReducer(initialState, {
      type: qEditor.actions.MOVE_FIELD,
      sectionId: 1,
      fieldId: 2,
      idx: 0
    })

    expect(state.byId[1].fields).to.eql([2, 1])
  })

  it('adds a field', function() {
    const state = sectionReducer(initialState, {
      type: qEditor.actions.ADD_FIELD,
      field: {_id: 1},
      sectionId: 1
    })

    expect(state.byId[1].fields).to.eql([1])
  })

  it('deletes a field', function() {
    const initialState = {
      byId: {1: {_id: 1, fields: [1, 2]}},
      allIds: [1]
    }
    const state = sectionReducer(initialState, {
      type: qEditor.actions.DELETE_FIELD,
      fieldId: 1,
      sectionId: 1
    })

    expect(state.byId[1].fields).to.eql([2])
  })
})
