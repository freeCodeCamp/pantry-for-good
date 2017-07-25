import React from 'react'
import {shallow} from 'enzyme'

import LoginBox from './LoginBox'
import FoodbankLogo from '../FoodbankLogo'
import {ErrorWrapper} from '../error'
import LoadingWrapper from '../LoadingWrapper'

describe('LoginBox', function() {
  it('renders', function() {
    const wrapper = shallow(
      <LoginBox
        formName="login"
        heading="Login"
      >
        foo
      </LoginBox>
    )

    expect(wrapper).to.have.className('login-box')
    expect(wrapper.find('.login-box-msg')).to.have.text('Login')
    expect(wrapper.find('form')).to.have.prop('name', 'login')
    expect(wrapper.find(ErrorWrapper).childAt(0)).to.have.text('foo')
  })

  it('shows logo', function () {
    const wrapper = shallow(
      <LoginBox
        formName="login"
        showLogo
      />
    )

    expect(wrapper.find(FoodbankLogo)).to.be.present()
  })

  it('shows loading spinner', function () {
    const wrapper = shallow(
      <LoginBox
        formName="login"
        loading
      />
    )

    expect(wrapper.find(LoadingWrapper)).to.be.present()
    expect(wrapper.find(LoadingWrapper)).to.have.prop('loading', true)
  })

  it('shows error message', function () {
    const wrapper = shallow(
      <LoginBox
        formName="login"
        error="error"
      />
    )

    expect(wrapper.find(ErrorWrapper)).to.be.present()
    expect(wrapper.find(ErrorWrapper)).to.have.props({
      error: 'error',
      errorBottom: true
    })
  })
})
