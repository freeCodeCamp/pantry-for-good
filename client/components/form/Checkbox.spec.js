import React from 'react'
import {shallow, mount} from 'enzyme'
import {Checkbox as RBCheckbox} from 'react-bootstrap'

import Checkbox from './Checkbox'

describe('Checkbox', function() {
  it('renders', function() {
    const wrapper = shallow(<Checkbox name="foo" />)
    const rbCheckbox = wrapper.find(RBCheckbox)

    expect(rbCheckbox).to.be.present()
    expect(rbCheckbox).to.have.prop('name', 'foo')
    expect(rbCheckbox.childAt(0).is('span')).to.be.true
  })

  it('renders children', function() {
    const wrapper = shallow(<Checkbox name="foo"><div>foo</div></Checkbox>)
    const rbCheckbox = wrapper.find(RBCheckbox)

    expect(rbCheckbox).to.contain(<div>foo</div>)
  })

  it('handles clicks', function() {
    const handler = sinon.spy()
    const wrapper = mount(<Checkbox name="foo" onClick={handler} />)

    wrapper.find('input').simulate('click')
    expect(handler).to.have.been.calledOnce
  })

  it('readonly stops propagation', function() {
    const withClickHandler = Checkbox.__get__('withClickHandler')

    const onClick = sinon.spy()
    const stopPropagation = sinon.spy()

    const WrappedComponent = sinon.spy(({handleCheckboxClick}) =>
      <div onClick={handleCheckboxClick}></div>)

    const Component = withClickHandler(WrappedComponent)
    const wrapper = shallow(<Component readOnly onClick={onClick} />)

    wrapper.simulate('click', {stopPropagation})
    expect(onClick).to.have.not.been.called
    expect(stopPropagation).to.have.been.calledOnce
  })
})
