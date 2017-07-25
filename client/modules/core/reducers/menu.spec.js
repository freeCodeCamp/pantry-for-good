import * as reducer from './menu'

describe('menu reducer', function() {
  it('fulfillsRole', function() {
    const fulfillsRole = reducer.default.__get__('fulfillsRole')
    const user = {roles: ['foo']}
    const item1 = {roles: ['foo']}
    const item2 = {roles: ['!foo']}

    expect(fulfillsRole(user)(item1)).to.be.true
    expect(fulfillsRole(user)(item2)).to.be.false
  })
})
