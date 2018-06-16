import React from 'react'
import Enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'

import {ADMIN_ROLE} from '../../../common/constants'
import ownerOrAdmin from './ownerOrAdmin'
import Unauthorized from '../../modules/core/components/errors/Unauthorized'

Enzyme.configure({adapter: new Adapter()})

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
