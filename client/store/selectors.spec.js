import {createSelector} from 'reselect'

import selectors from './selectors'

describe('selectors', function() {
  it('returns an object', function() {
    expect(selectors).to.be.an('object')
    expect(selectors).to.include.keys(['app', 'customer'])
  })

  it('getOne pattern memoizes', function() {
    const state = {ids: [1, 2, 3]}
    const selector = id => createSelector(
      state => state.ids,
      ids => ids.filter(_id => _id === id)
    )

    const getId2 = selector(2)
    const getId3 = selector(3)

    getId2(state)
    getId2(state)
    getId3(state)
    getId3(state)

    expect(getId2.recomputations()).to.equal(1)
    expect(getId3.recomputations()).to.equal(1)
  })
})
