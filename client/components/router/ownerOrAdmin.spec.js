import React from 'react'
import {shallow} from 'enzyme'

import {ADMIN_ROLE} from '../../../common/constants'
import ownerOrAdmin from './ownerOrAdmin'
import Unauthorized from '../../modules/core/components/errors/Unauthorized'

describe('ownerOrAdmin', function() {
  it('renders if admin', function() {
    const enhanceMock = x => x
    ownerOrAdmin.__Rewire__('enhance', enhanceMock)
    const wrappedComponent = () => null
    const Component = ownerOrAdmin()(wrappedComponent)
    const wrapper = shallow(<Component user={{roles: [ADMIN_ROLE]}}/>)

    expect(wrapper.find(wrappedComponent)).to.be.present()
  })

  it('renders if owner', function() {
    const enhanceMock = x => x
    ownerOrAdmin.__Rewire__('enhance', enhanceMock)
    const wrappedComponent = () => null
    const Component = ownerOrAdmin('userId')(wrappedComponent)
    const wrapper = shallow(
      <Component
        user={{_id: 1, roles: []}}
        match={{params: {userId: '1'}}}
      />
    )

    expect(wrapper.find(wrappedComponent)).to.be.present()
  })

  it('renders unauthorized', function() {
    const enhanceMock = x => x
    ownerOrAdmin.__Rewire__('enhance', enhanceMock)
    const wrappedComponent = () => null
    const Component = ownerOrAdmin('userId')(wrappedComponent)
    const wrapper = shallow(
      <Component
        user={{_id: 1, roles: []}}
        match={{params: {userId: '2'}}}
      />
    )

    expect(wrapper.find(Unauthorized)).to.be.present()
  })
})
