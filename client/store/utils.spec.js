import {crudActions, crudReducer} from './utils'

describe('reducer utils', function() {
  let actions, reducer

  before(function() {
    actions = crudActions('foo')
    reducer = crudReducer('foo')
  })

  it('crudActions returns actions', function() {
    expect(actions).to.be.an('object')
    expect(Object.keys(actions)).to.have.property('length', 12)
  })

  it('crudReducer sets fetching flag', function() {
    const loadAllState = reducer(null, {type: actions.LOAD_ALL_REQUEST})
    const loadOneState = reducer(null, {type: actions.LOAD_ONE_REQUEST})
    expect(loadAllState.fetching).to.be.true
    expect(loadAllState.fetchError).to.not.exist
    expect(loadAllState.saving).to.be.false
    expect(loadAllState.saveError).to.not.exist
    expect(loadOneState.fetching).to.be.true
  })

  it('crudReducer sets saving flag', function() {
    const saveState = reducer(null, {type: actions.SAVE_REQUEST})
    const deleteState = reducer(null, {type: actions.DELETE_REQUEST})
    expect(saveState.saving).to.be.true
    expect(saveState.saveError).to.not.exist
    expect(saveState.fetching).to.be.false
    expect(saveState.fetchError).to.not.exist
    expect(deleteState.saving).to.be.true
  })

  it('crudReducer sets error flags', function() {
    const loadState = reducer(null, {
      type: actions.LOAD_ALL_FAILURE,
      error: 'error'
    })
    const saveState = reducer(null, {
      type: actions.SAVE_FAILURE,
      error: 'error'
    })
    expect(loadState.fetching).to.be.false
    expect(loadState.fetchError).to.equal('error')
    expect(loadState.saving).to.be.false
    expect(loadState.saveError).to.not.exist
    expect(saveState.fetching).to.be.false
    expect(saveState.fetchError).to.not.exist
    expect(saveState.saving).to.be.false
    expect(saveState.saveError).to.equal('error')
  })

  it('crudReducer merges/removes result', function() {
    const initialState = {ids: [1, 2, 3]}

    const loadNew = reducer(initialState, {
      type: actions.LOAD_ONE_SUCCESS,
      response: {result: [4]}
    })

    const loadExisting = reducer(initialState, {
      type: actions.LOAD_ONE_SUCCESS,
      response: {result: [3]}
    })

    const deleteOne = reducer(initialState, {
      type: actions.DELETE_SUCCESS,
      response: {result: [3]}
    })

    expect(loadNew.ids).to.have.property('length', 4)
    expect(loadNew.ids).to.eql([1, 2, 3, 4])
    expect(loadExisting.ids).to.have.property('length', 3)
    expect(loadExisting.ids).to.eql([1, 2, 3])
    expect(deleteOne.ids).to.have.property('length', 2)
    expect(deleteOne.ids).to.eql([1, 2])
  })
})
