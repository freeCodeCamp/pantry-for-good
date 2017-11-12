import React from 'react'
import {mount, shallow} from 'enzyme'

import withConfirmNavigation from './withConfirmNavigation'

describe('withConfirmNavigation', function() {
  before(function() {
    const enhanceMock = x => x
    withConfirmNavigation.__Rewire__('enhance', enhanceMock)
  })

  after(function() {
    withConfirmNavigation.__ResetDependency__('enhance')
  })

  it('renders wrapped component', function() {
    const WrappedComponent = sinon.spy(() => null)
    const Component = withConfirmNavigation(WrappedComponent)

    shallow(<Component prop="foo" />).dive()
    expect(WrappedComponent).to.have.been.calledWithMatch({prop: 'foo'})
  })

  it('adds and removes window beforeunload listeners', function() {
    const WrappedComponent = () => null
    const Component = withConfirmNavigation(WrappedComponent)

    const wrapper = shallow(<Component dirty={false} />)
    const addListenerSpy = sinon.spy(window, 'addEventListener')
    const removeListenerSpy = sinon.spy(window, 'removeEventListener')

    wrapper.setProps({dirty: true})
    wrapper.setProps({dirty: false})

    expect(addListenerSpy).to.have.been.calledWith('beforeunload')
    expect(removeListenerSpy).to.have.been.calledWith('beforeunload')

    addListenerSpy.restore()
    removeListenerSpy.restore()
  })

  it('blocks navigation', function() {
    const unblockMock = sinon.spy()
    const historyMock = {
      block: sinon.spy(() => unblockMock)
    }

    const WrappedComponent = () => null
    const Component = withConfirmNavigation(WrappedComponent)

    const wrapper = mount(<Component dirty={true} history={historyMock} />)

    expect(historyMock.block).to.have.been.calledOnce
    wrapper.unmount()
    expect(unblockMock).to.have.been.calledOnce
  })
})
