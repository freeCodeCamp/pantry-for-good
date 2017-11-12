import entityReducer from './entities'

describe('entity reducer', function() {
  it('adds entities from response', function() {
    const initialState = {
      customers: {
        '1': {id: 1},
        '2': {id: 2}
      }
    }

    const newState = entityReducer(initialState, {
      response: {
        entities: {
          customers: {
            '3': {id: 3}
          }
        }
      }
    })

    expect(Object.keys(newState.customers)).to.have.property('length', 3)
  })

  it('removes array elements from merged entities', function() {
    const initialState = {
      customers: {
        '1': {id: 1, data: [1, 2]},
        '2': {id: 2, data: [3, 4]}
      }
    }

    const newState = entityReducer(initialState, {
      response: {
        entities: {
          customers: {
            '1': {id: 1, data: [1]}
          }
        }
      }
    })

    expect(newState.customers['1'].data).to.eql([1])
  })
})
